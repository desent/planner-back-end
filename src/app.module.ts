import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { TaskModule } from './task/task.module';

@Module({
  imports: [AuthModule, ConfigModule.forRoot(), UserModule, TaskModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
