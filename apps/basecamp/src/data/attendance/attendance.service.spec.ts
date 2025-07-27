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
  });
  afterEach(() => {
    jest.clearAllMocks();
});
});
