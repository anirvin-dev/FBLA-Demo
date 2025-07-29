import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SheetService } from '../../sheet/sheet.service';
import z from 'zod';

const AttendanceSchema = z.object({
  discordId: z.string(),
  team: z.string(),
  discordName: z.string(),
  date: z.string(),
  isSigningIn: z.boolean(),
});

type AttendanceOperationResult =
  | {
      success: true;
    }
  | {
      success: false;
      message: string;
    };

@Injectable()
export class AttendanceService {
  private readonly attendanceSheetId: string;
  private readonly logger = new Logger(AttendanceService.name);

  constructor(
    private readonly sheetService: SheetService,
    private readonly configService: ConfigService,
  ) {
    const attendanceSheetId = this.configService.get<string>(
      'ATTENDANCE_SPREADSHEET_ID',
    );

    if (!attendanceSheetId) {
      throw new Error('ATTENDANCE_SPREADSHEET_ID is not set');
    }

    this.attendanceSheetId = attendanceSheetId;
  }

  private async performAttendanceOperation(
    discordId: string,
    discordName: string,
    guildId: string,
    operation: 'signIn' | 'signOut',
    date: Date = new Date(),
  ): Promise<boolean> {
    let team = '';
    switch (guildId) {
      case this.configService.get<string>('YETI_SERVER_ID'):
        team = 'YETI Robotics';
        break;
      case this.configService.get<string>('DEV_GUILD_ID'):
        team = 'Dev';
        break;
    }

    console.log(guildId, this.configService.get<string>('YETI_SERVER_ID'));

    const attendance = AttendanceSchema.parse({
      discordId,
      team,
      discordName,
      date: date.toISOString(),
      isSigningIn: operation === 'signIn',
    });

    try {
      const result = await this.sheetService.appendSheetValues(
        this.attendanceSheetId,
        'Attendance!A:D',
        [
          ['discordId', 'team', 'discordName', 'date', 'isSigningIn'].map(
            (value) => attendance[value as keyof typeof attendance].toString(),
          ),
        ],
      );

      if (result.updates?.updatedRows && result.updates.updatedRows >= 1) {
        return true;
      }

      return false;
    } catch (error) {
      this.logger.error(`Failed to perform attendance operation: ${error}`);
      return false;
    }
  }

  public async getAttendance(
    discordId: string,
  ): Promise<z.infer<typeof AttendanceSchema>[]> {
    const attendance = await this.sheetService.getSheetValues(
      this.attendanceSheetId,
      `Attendance!A:E`,
    );

    if (!attendance) {
      return [];
    }

    const userAttendance = attendance.filter((row) => row[0] === discordId);

    return userAttendance.map((row) => {
      return AttendanceSchema.parse({
        discordId: row[0],
        team: row[1],
        discordName: row[2],
        date: row[3],
        isSigningIn: row[4] === 'true' || row[4] === 'TRUE',
      });
    });
  }

  public async signIn(
    discordId: string,
    guildId: string,
    discordName: string,
  ): Promise<AttendanceOperationResult> {
    const existingAttendance = await this.getAttendance(discordId);

    const lastOperation = existingAttendance.at(-1);

    if (lastOperation?.isSigningIn) {
      const lastDate = new Date(lastOperation.date);
      const currentDate = new Date();

      if (currentDate.getTime() - lastDate.getTime() < 1000 * 60 * 60 * 3.5) {
        return {
          success: false,
          message: 'You are currently signed in.',
        };
      } else {
        try {
          const halfCreditResult = await this.performAttendanceOperation(
            discordId,
            discordName,
            guildId,
            'signOut',
            new Date(currentDate.getTime() - 1000 * 60 * 60 * 1.5),
          );
          const newSigninResult = await this.performAttendanceOperation(
            discordId,
            discordName,
            guildId,
            'signIn',
          );

          if (halfCreditResult && newSigninResult) {
            return {
              success: false,
              message: 'You signed in last meeting but did not sign out. You will be credited for 1.5 hours of attendance for that meeting.\n Signed in successfully.',
            }
          } else {
            return {
              success: false,
              message: 'Failed to sign in',
            }
          }
        } catch (error) {
          this.logger.error(`Failed to sign in: ${error}`);
          return {
            success: false,
            message: 'Failed to sign in.',
          };
        }
      }
    }

    try {
      await this.performAttendanceOperation(
        discordId,
        discordName,
        guildId,
        'signIn',
      );
      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(`Failed to sign in: ${error}`);
      return {
        success: false,
        message: 'Failed to sign in.',
      };
    }
  }

  public async signOut(
    discordId: string,
    guildId: string,
    discordName: string,
  ): Promise<AttendanceOperationResult> {
    const existingAttendance = await this.getAttendance(discordId);

    const lastOperation = existingAttendance.at(-1);

    if (!lastOperation?.isSigningIn) {
      return {
        success: false,
        message: 'You are not signed in.',
      };
    } else if (
      new Date().getTime() - new Date(lastOperation.date).getTime() >
      1000 * 60 * 60 * 18
    ) {
      try {
        await this.performAttendanceOperation(
          discordId,
          discordName,
          guildId,
          'signIn',
          new Date(new Date().getTime() - 1000 * 60 * 60 * 1.5),
        );
      } catch (error) {
        this.logger.error(`Failed to sign out: ${error}`);
        return {
          success: false,
          message: 'Failed to sign out.',
        };
      }
    }

    try {
      await this.performAttendanceOperation(
        discordId,
        discordName,
        guildId,
        'signOut',
      );
      return {
        success: true,
      };
    } catch (error) {
      this.logger.error(`Failed to sign out: ${error}`);
      return {
        success: false,
        message: 'Failed to sign out.',
      };
    }
  }

  /**
   * Get the total hours worked by a user
   * @param discordId The Discord ID of the user
   *
   * @throws Error if the attendance record is invalid
   * @returns The total hours worked by the user
   */
  public async getUserHours(discordId: string): Promise<number> {
    const attendance = await this.getAttendance(discordId);

    let hours = 0;
    let lastSignIn: Date | null = null;
    for (const attendanceRecord of attendance) {
      const isSigningIn = attendanceRecord.isSigningIn;
      const date = new Date(attendanceRecord.date);

      if (isSigningIn) {
        lastSignIn = date;
      } else if (lastSignIn) {
        hours += (date.getTime() - lastSignIn.getTime()) / (1000 * 60 * 60);
        lastSignIn = null;
      } else {
        throw new Error('Invalid attendance record');
      }
    }

    return hours;
  }

  public async getTopMembersByHours(limit: number = 5): Promise<{ userName: string; totalHours: number }[]> {
    try {
      const sheet = await this.sheetService.getSheetValues(
        this.attendanceSheetId,
        'Attendance!A:E',
      );

      if (!sheet || sheet.length <= 1) {
        return [];
      }

      type AttendanceRecord = {
        discordID: string;
        discordName: string;
        date: string;
        isSigningIn:boolean;
      }

      const allAttendance: AttendanceRecord[] = [];

      for (let i = 1; i < sheet.length; i++) {
        const row = sheet[i];


      if (row.length >= 5) {  
    allAttendance.push({
      discordID: String(row[0]),
      discordName: String(row[2]),
      date: String(row[3]),
      isSigningIn: row[4] === 'true' || row[4] === 'TRUE',
    });
  }
}

const userSessions = new Map<string, {
  userName: string;
  sessions: Array<{ signIn?: Date; signOut?: Date }>;
}>();

for (const record of allAttendance) {
  if (!userSessions.has(record.discordID)) {
    userSessions.set(record.discordID, {
      userName: record.discordName,
      sessions: [{}]
    });
  }
  
  const user = userSessions.get(record.discordID)!;
  const currentSession = user.sessions[user.sessions.length - 1];

  if (record.isSigningIn) {
    if (currentSession.signIn) {
      user.sessions.push({ signIn: new Date(record.date) });
    } else {
      currentSession.signIn = new Date(record.date);
    }
  } else {
    currentSession.signOut = new Date(record.date);


    } catch (error) {
      this.logger.error(`Error getting attendance leaderboard: ${error}`);
      return [];
    }
  }
}
