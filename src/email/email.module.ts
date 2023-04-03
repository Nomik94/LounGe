import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { UserRepository } from 'src/common/repository/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [EmailService, UserService, UserRepository],
  exports: [EmailService],
  controllers: [EmailController],
})
export class EmailModule {}
