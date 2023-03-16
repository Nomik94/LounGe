import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-kakao';

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
  constructor() {
    super({
      clientID: process.env.KAKAO_ID,
      callbackURL: process.env.KAKAO_CALLBACKURL,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
      scope: ['account_email', 'profile_nickname'],
    });
  }

  async validate(accessToken, refreshToken, profile: Profile) {
    return {
      username: profile._json.properties.nickname,
      email: profile._json.kakao_account.email,
    };
  }
}
