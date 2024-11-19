import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphController } from './graph/graph.controller';
import { GraphModule } from './graph/graph.module';
import { DepartmentsModule } from './departments/departments.module';
import { GraphService } from './graph/graph.service';
import { ReportModule } from './report/report.module';
import { WalkthroughModule } from './walkthrough/walkthrough.module';
import { LogModule } from './log/log.module';
// import { AuthModule } from './auth/auth.module';
import { AreaModule } from './area/area.module';
import { DatapointModule } from './datapoint/datapoint.module';
import { UserModule } from './user/user.module';
import { clerkMiddleware } from '@clerk/express';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        uri: config.get<string>('MONGO_URI'),
        dbName: 'Logs',
      }),
    }),
    GraphModule,
    DepartmentsModule,
    ReportModule,
    WalkthroughModule,
    LogModule,
    // AuthModule,
    AreaModule,
    DatapointModule,
    UserModule,
  ],
  controllers: [AppController, GraphController],
  providers: [AppService, GraphService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(clerkMiddleware()).forRoutes('*');
  }
}
