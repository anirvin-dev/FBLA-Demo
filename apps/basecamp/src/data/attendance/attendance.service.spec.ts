import { Test, TestingModule } from '@nestjs/testing';
import { AttendanceService } from './attendance.service';
import { SheetService } from '../../sheet/sheet.service';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

describe('AttendanceService', () => {
    let service: AttendanceService;
    let sheetService: jest.Mocked<SheetService>;
    let configService: jest.Mocked<ConfigService>;
  });