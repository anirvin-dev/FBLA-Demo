import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceTwofaController } from './attendance-twofa.controller';

describe('AttendanceTwofaController', () => {
  let controller: AttendanceTwofaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendanceTwofaController],
    }).compile();

    controller = module.get<AttendanceTwofaController>(
      AttendanceTwofaController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
