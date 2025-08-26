import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceTwoFAService } from './attendance-twofa.service';

describe('TwofaService', () => {
  let service: AttendanceTwoFAService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AttendanceTwoFAService],
    }).compile();

    service = module.get<AttendanceTwoFAService>(AttendanceTwoFAService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
