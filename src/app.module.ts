import { PrismaModule } from '@libs/prisma';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { appConfiguration } from 'config/config';
import { FileModule } from './file/file.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [appConfiguration] }),
    ScheduleModule.forRoot(),
    PrismaModule,
    FileModule,
  ],
})
export class AppModule {}
