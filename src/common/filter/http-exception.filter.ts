import { Catch, ExceptionFilter, HttpException } from '@nestjs/common';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException) {
    const status = exception.getStatus();
    const message = exception.message;

    console.log('=================================');
    console.log('예외내용:', message);
    console.log('예외코드:', status);
    console.log('=================================');

    if (status === 500) {
      return new HttpException('서버 문제입니다', 500);
    }
  }
}
