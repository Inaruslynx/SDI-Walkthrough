import { Controller } from '@nestjs/common';
import { ReportService } from './report.service';

@Controller('report')
export class ReportController {
  constructor(private readonly reportService: ReportService) { }
  
  @Get(':walkthrough')
  find(@Param('walkthrough') walkthrough: string) {
    return this.reportService.find(walkthrough);
  }
}
