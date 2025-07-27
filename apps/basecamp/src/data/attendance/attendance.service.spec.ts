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
                        get: jest.fn(),
                    },
                },
            ],
        }).compile();
        
        service = module.get<AttendanceService>(AttendanceService);
        sheetService = module.get(SheetService);
        configService = module.get(ConfigService);

        configService.get.mockImplementation((key: string) => {
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
        });
  });
  afterEach(() => {
    jest.clearAllMocks();
});

it('should be defined',() => {
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
        
        // Should return 2 records (1 sign-in and 1 sign-out)
        expect(result).toHaveLength(2);
        // All records should belong to user1
        expect(result.every(record => record.discordId === 'user1')).toBe(true);
        // Should maintain the order of records
        expect(result[0].isSigningIn).toBe(true);
        expect(result[1].isSigningIn).toBe(false);
});

it('should return empty array when user has no attendance records', async () => {
    // Mock data with only user2's records
    const otherUserData = [
        ['user2', 'YETI Robotics', 'Test User 2', '2025-01-01T10:00:00Z', 'true'],
        ['user2', 'YETI Robotics', 'Test User 2', '2025-01-01T12:00:00Z', 'false'],
    ];
    sheetService.getSheetValues.mockResolvedValue(otherUserData);
    
    // Try to get attendance for user1, who has no records
    const result = await service.getAttendance('user1');
    
    // Should return empty array since user1 has no records
    expect(result).toEqual([]);
});
});});
