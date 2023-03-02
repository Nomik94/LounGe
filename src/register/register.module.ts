import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/database/entities/user.entity';
import { RegisterController } from './register.controller';
import { RegisterService } from './register.service';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [RegisterController],
  providers: [RegisterService],
})
export class RegisterModule {}

// inject: [ConfigService],
// useFactory: (config: ConfigService) => ({
//   secret: config.get<string>('JWT_SECRET'),
//   signOptions: { expiresIn: config.get<string>('JWT_EXPIRESIN') },
// }),
