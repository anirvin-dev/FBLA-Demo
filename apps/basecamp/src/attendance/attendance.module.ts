import { Module } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { SheetModule } from '../sheet/sheet.module';
import { AttendanceTwoFAService } from './attendance-twofa/attendance-twofa.service';
import { AttendanceTwofaController } from './attendance-twofa/attendance-twofa.controller';

@Module({
  imports: [SheetModule],
  providers: [AttendanceService, AttendanceTwoFAService],
  exports: [AttendanceService],
  controllers: [AttendanceTwofaController],
})
export class AttendanceModule {}
