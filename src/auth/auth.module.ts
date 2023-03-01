import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
<<<<<<< HEAD
  imports : [TypeOrmModule.forFeature([User])],
=======
  imports: [TypeOrmModule.forFeature([User])],
>>>>>>> dev
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
