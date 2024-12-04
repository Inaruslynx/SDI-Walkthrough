import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { GraphService } from './graph.service';

@Controller('graph')
export class GraphController {
  constructor(private graphService: GraphService) {}
  @Get()
  getGraphData(
    @Query('walkthrough') walkthrough: string,
    @Query('selectedDataPoint') selectedDataPoint: string,
    @Query('toDate') toDate: string,
    @Query('fromDate') fromDate: string,
  ) {
    return this.graphService.getGraphData(
      walkthrough,
      selectedDataPoint,
      toDate,
      fromDate,
    );
  }

  // @Post()
  // processGraphFetch(
  //   @Body('walkthrough') walkthrough: string,
  //   @Body('fromDate') fromDate: string,
  //   @Body('toDate') toDate: string,
  //   @Body('dataSelection') dataSelection: string,
  // ) {
  //   return this.graphService.processGraphFetch(
  //     walkthrough,
  //     fromDate,
  //     toDate,
  //     dataSelection,
  //   );
  // }
}
