import { Logger } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

// groupImgs 폴더가 존재하지 않으면 폴더를 생성하고, 존재하면 생성하지 않습니다.
const mkdir = (directory: string) => {
  const logger = new Logger('Mkdir');
  try {
    fs.readdirSync(path.join(process.cwd()+'/public/', directory));
  } catch (err) {
    logger.log(
      `지정한 경로에 ${directory}가 존재하지 않아 ${directory}를 생성합니다.`,
    );
    fs.mkdirSync(path.join(process.cwd()+'/public/', directory));
  }
};

mkdir('groupImage');
mkdir('backgroundImage');

export const groupImageFactory = (): MulterOptions => {
  return {
    storage: multer.diskStorage({
      destination(req, file, done) { // 파일을 저장할 위치를 설정합니다
        if(file.fieldname === 'groupImage') {
          done(null, path.join(process.cwd()+'/public/', 'groupImage'));
        } else {
          done(null, path.join(process.cwd()+'/public/', 'backgroundImage'));
        }
      },

      filename(req, file, done) { // 파일의 이름을 설정합니다.
        console.log(file)
        const ext = path.extname(file.originalname); // 파일 확장자 추출
        const basename = Math.floor(Math.random() * 100000000)
        // 파일 이름이 중복되는 것을 막기 위해 '파일이름_날짜.확장자' 의 형식으로 파일이름을 지정합니다.
        done(null, `${basename}_${Date.now()}${ext}`);  
      },
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, // 10MB로 크기를 제한
    // fields : [{name : 'groupImage', maxCount : 1}]
  };
};