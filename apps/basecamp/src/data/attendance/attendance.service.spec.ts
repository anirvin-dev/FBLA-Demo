import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { SheetService } from '../../sheet/sheet.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

describe('AttendanceService', () => {
    let service: AttendanceService;
    let sheetService: jest.Mocked<SheetService>;
    let configService: jest.Mocked<ConfigService>;

    const mockAttendanceData = [
    // User1's attendance
    ['user1', 'YETI Robotics', 'Test User 1', '2025-01-01T10:00:00Z', 'true'],  // Sign in
    ['user1', 'YETI Robotics', 'Test User 1', '2025-01-01T12:00:00Z', 'false'], // Sign out
    // User2's attendance
    ['user2', 'Dev', 'Test User 2', '2025-01-02T10:00:00Z', 'true'],  // Sign in
    ['user2', 'Dev', 'Test User 2', '2025-01-02T12:00:00Z', 'false'], // Sign out
    // Another session for User1
    ['user1', 'YETI Robotics', 'Test User 1', '2025-01-03T10:00:00Z', 'true'],  // Sign in
    ['user1', 'YETI Robotics', 'Test User 1', '2025-01-03T12:00:00Z', 'false'], // Sign out
    ];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AttendanceService,
                {
                    provide: SheetService,
                    useValue: {
                        getSheetValues: jest.fn(),
                        appendSheetValues: jest.fn(),
                    },
                },
                {
                    provide: ConfigService,
                    useValue: {
                        get: jest.fn().mockImplementation((key: string) => {
                            switch (key) {
                                case 'ATTENDANCE_SPREADSHEET_ID':
                                    return 'test-sheet-id';
                                case 'YETI_SERVER_ID':
                                    return 'yeti-server-id';
                                case 'DEV_GUILD_ID':
                                    return 'dev-guild-id';
                                default:
                                    return null;
                            }
                        }),
                    },
                },
            ],
        }).compile();

        service = module.get<AttendanceService>(AttendanceService);
        sheetService = module.get(SheetService);
        configService = module.get(ConfigService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('getAttendance', () => {
        it('should return empty array when no attendance records exist', async () => {
            sheetService.getSheetValues.mockResolvedValue([]);
            const result = await service.getAttendance('user1');

            expect(result).toEqual([]);
            expect(sheetService.getSheetValues).toHaveBeenCalledWith(
                'test-sheet-id',
                'Attendance!A:E'
            );
        });

        it('should return filtered attendance records for a specific user', async () => {
            sheetService.getSheetValues.mockResolvedValue(mockAttendanceData);

            const result = await service.getAttendance('user1');

            // Expect 4 records (2 sign-ins and 2 sign-outs for user1)
            expect(result).toHaveLength(4);
            expect(result.every(record => record.discordId === 'user1')).toBe(true);
            // Verify the first record is a sign-in
            expect(result[0].isSigningIn).toBe(true);
            // Verify the second record is a sign-out
            expect(result[1].isSigningIn).toBe(false);
            // Verify the third record is a sign-in
            expect(result[2].isSigningIn).toBe(true);
            // Verify the fourth record is a sign-out
            expect(result[3].isSigningIn).toBe(false);
        });

    it('should handle when user has no attendance records', async () => {
      sheetService.getSheetValues.mockResolvedValue(mockAttendanceData);

      const result = await service.getAttendance('nonexistent-user');

            expect(result).toEqual([]);
        });
    });
});
