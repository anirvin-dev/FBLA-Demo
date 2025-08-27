import { Controller, Get, HttpStatus, Res, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { AttendanceTwoFAService } from './attendance-twofa.service';
import { AttendanceTwofaGuard } from './attendance-twofa.guard';

@Controller('2fa')
@UseGuards(AttendanceTwofaGuard)
export class AttendanceTwofaController {
  constructor(
    private readonly attendanceTwofaService: AttendanceTwoFAService,
  ) {}

  @Get()
  getCode(@Res() res: Response) {
    const code = this.attendanceTwofaService.getOrCreateCode();
    return res.status(HttpStatus.OK).json({ code });
  }
}
