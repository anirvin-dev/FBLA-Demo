import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';
import { AttendanceTwoFAService } from './attendance-twofa.service';

@Controller('2fa')
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
