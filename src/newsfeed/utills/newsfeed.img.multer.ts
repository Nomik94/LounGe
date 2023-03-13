import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { mkdirSync } from 'fs';

// newsfeedImage 폴더가 존재하지 않으면 폴더를 생성하고 있으면 동기화해라
const mkdir = (directory:string) => {
  try {
    fs.readdirSync(path.join(process.cwd()+'/public/',directory))
    // process.cwd는 절대경로. 즉 뒤의 + 퍼블릭과 함께해서 절대경로에서 퍼블릭 폴더에
    // 파일을 읽어들여라.
  } catch(err) {
    console.log('해당 경로에 폴더가 존재하지 않아 폴더를 생성합니다.');
    fs.mkdirSync(path.join(process.cwd()+'/public/', directory));
    // 해당 절대 경로에 폴더가 없을 경우 캐치문으로 빠져나간다 = 폴더가 없다
    // 그러면 해당 절대 경로에 폴더를 새로 만들어라.
  } 
}

mkdir('newsfeedImages')

export const newsfeedImageFactory = (): MulterOptions => {
  return {
    storage: multer.diskStorage({
      // destination 경로라는 뜻
      destination(req,file,done) {
        // 만약 뉴스피드 이미지란 폴더가 존재하지 않을 경우 해당 이름으로 폴더 생성
        const newsfeedImagePath = 'newsfeedImages'
        // if(!newsfeedImagePath) {
        //   mkdirSync(newsfeedImagePath)
        // } 
        if(file.fieldname === newsfeedImagePath) {
          done(null, path.join(process.cwd()+'/public/', newsfeedImagePath))
        }
      },

      filename(req,file,done) {
        const ext = path.extname(file.originalname) // 파일 확장자
        const basename = Math.floor(Math.random() * 100000000)
        // 파일 이름이 중복되지 않게 이름을 랜덤 변수로 지정 '파일이름_날짜.확장자'의 형태로 저장
        done(null, `${basename}_${Date.now()}${ext}`)
        
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, 
  }
}