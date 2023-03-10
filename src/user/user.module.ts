import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { userImageFactory } from 'src/auth/utils/user.img.multer';
import { User } from 'src/database/entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MulterModule.registerAsync({ useFactory: userImageFactory }),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
