import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { GroupsModule } from './groups/groups.module';

@Module({
  imports: [UsersModule, MongooseModule.forRoot('mongodb://0.0.0.0:27017/slideee'), AuthModule, GroupsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
