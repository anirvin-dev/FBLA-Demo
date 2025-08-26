import { Module } from '@nestjs/common';
import { OutreachService } from './outreach.service';
import { SheetModule } from 'src/sheet/sheet.module';

@Module({
  imports: [SheetModule],
  providers: [OutreachService],
  exports: [OutreachService],
})
export class OutreachModule {}
