import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GraphService } from './graph.service';

@Controller('graph')
export class GraphController {
  constructor(private graphService: GraphService) {}
  @Get()
  getGraphData(@Query('walkthrough') walkthrough: string) {
    return this.graphService.getGraphData(walkthrough);
  }

  @Post()
  processGraphFetch(
    @Body('walkthrough') walkthrough: string,
    @Body('fromDate') fromDate: string,
    @Body('toDate') toDate: string,
    @Body('dataSelection') dataSelection: string,
  ) {
    return this.graphService.processGraphFetch(walkthrough, fromDate, toDate, dataSelection);
  }
}
