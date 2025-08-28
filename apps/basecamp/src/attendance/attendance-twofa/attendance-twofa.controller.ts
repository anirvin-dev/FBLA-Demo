import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Response } from 'express';
import { AttendanceTwoFAService } from './attendance-twofa.service';
import { AttendanceTwofaGuard } from './attendance-twofa.guard';
import {
  AttendanceTwofaSignInDto,
  AttendanceTwofaValidateDto,
} from './attendance-twofa.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Controller('2fa')
export class AttendanceTwofaController {
  constructor(
    private readonly attendanceTwofaService: AttendanceTwoFAService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  @UseGuards(AttendanceTwofaGuard)
  getCode(@Res() res: Response) {
    const code = this.attendanceTwofaService.getOrCreateCode();
    return res.status(HttpStatus.OK).json({ code });
  }

  @Post('authenticate')
  signIn(@Body() { password }: AttendanceTwofaSignInDto, @Res() res: Response) {
    const expectedPassword = this.configService.get<string | undefined>(
      'ATTENDANCE_2FA_PASSWORD',
      undefined,
    );

    console.log(password, expectedPassword);

    console.log(password, expectedPassword, password === expectedPassword);

    if (!password || password !== expectedPassword) {
      throw new UnauthorizedException('Invalid password');
    }

    const token = this.jwtService.sign({
      sub: 'attendance-2fa',
    });

    return res.status(HttpStatus.ACCEPTED).json({ message: 'Accepted', token });
  }

  @Post('validate')
  validateToken(
    @Body() { token }: AttendanceTwofaValidateDto,
    @Res() res: Response,
  ) {
    try {
      console.log(token);
      this.jwtService.verify(token);
    } catch (error) {
      console.error(error);
      throw new UnauthorizedException('Invalid token');
    }

    return res.status(HttpStatus.OK).json({ message: 'Valid' });
  }
}
