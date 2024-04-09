import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphController } from './graph/graph.controller';
import { GraphModule } from './graph/graph.module';
import { DepartmentsModule } from './departments/departments.module';

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
  ],
  controllers: [AppController, GraphController],
  providers: [AppService],
})
export class AppModule {}

// `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@127.0.0.1:27017/?authMechanism=DEFAULT`
// 'mongodb://DataEntry:secret@localhost:27017/?authMechanism=DEFAULT'
