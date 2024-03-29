import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from 'src/common/repository/user.repository';
import { multerOptionsFactory } from 'src/common/utils/multer.options';
import { User } from 'src/database/entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { UserService } from 'src/user/user.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtRefreshStrategy } from './strategy/jwt.refresh.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { KakaoStrategy } from './strategy/kakao.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({}),
    MulterModule.registerAsync({ useFactory: multerOptionsFactory }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    EmailService,
    KakaoStrategy,
    LocalStrategy,
    UserService,
    JwtRefreshStrategy,
    UserRepository,
  ],
  exports: [AuthService, JwtModule],
})
export class AuthModule {}
