import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { SheetModule } from '../sheet/sheet.module';
import { AttendanceTwoFAService } from './attendance-twofa/attendance-twofa.service';
import { AttendanceTwofaController } from './attendance-twofa/attendance-twofa.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    SheetModule,
    JwtModule.registerAsync({
      global: true,
      useFactory: (configService: ConfigService) => {
        console.log(configService.get('JWT_SECRET'));
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            algorithm: 'HS256',
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [AttendanceService, AttendanceTwoFAService],
  exports: [AttendanceService],
  controllers: [AttendanceTwofaController],
})
export class AttendanceModule {}
