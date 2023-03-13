<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=transparent&color=auto&height=200&section=header&text=LounGe&fontSize=90" />
</div>

---

<div align='center'><h2>소모임 커뮤니티 with 캘린더</h2>
</div>
<div align='center'>같은 취미를 가진 사람을 찾고 싶으신가요?<br>
저희는 새로운 사람을 만나는 것을 즐기고 일정을 공유하여 건강한 만남을 가지는 커뮤니티를 지향합니다.
</div>

## 멤버

|    이름    |  역할  |                               깃허브                               |
| :--------: | :----: | :----------------------------------------------------------------: |
| **김정민** |  팀장  |       [Nomik94](https://github.com/Nomik94?tab=repositories)       |
| **오길환** | 부팀장 |        [5kiran](https://github.com/5kiran?tab=repositories)        |
| **한주호** |  팀원  |      [Joto-Han](https://github.com/Joto-Han?tab=repositories)      |
| **김택환** |  팀원  | [taekhwankim21](https://github.com/taekhwankim21?tab=repositories) |
| **유진우** |  팀원  |   [goodjwyoo77](https://github.com/goodjwyoo77?tab=repositories)   |

## 배포 주소

## 프로젝트 기간

2023.02.28 ~ 2023.04.03

<div align='center'>
<h3>📚 Tech Stack 📚</h3>
</div>
<div align='center'>
<img src="https://img.shields.io/badge/Handelbars-000000?style=flat&logo=Handlebars.js&logoColor=white"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=CSS3&logoColor=white"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=JavaScript&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=TypeScript&logoColor=white"/>
<img src="https://img.shields.io/badge/Node.js-339933?style=flat&logo=Node.js&logoColor=white"/>
<br>
<img src="https://img.shields.io/badge/NestJs-E0234E?style=flat&logo=NestJs&logoColor=white"/>
<img src="https://img.shields.io/badge/TypeORM-blue" alt="TypeORM">
<img src="https://img.shields.io/badge/AWS-232F3E?style=flat&logo=Amazon AWS&logoColor=white"/>
<img src="https://img.shields.io/badge/Jest-C21325?style=flat&logo=Jest&logoColor=white"/>
<img src="https://img.shields.io/badge/Mysql-4479A1?style=flat&logo=Mysql&logoColor=white"/>
<br>
<img src="https://img.shields.io/badge/Redis-DC382D?style=flat&logo=Redis&logoColor=white"/>
</div>

<div align='center'>
<h3>🛠 Tools 🛠</h3>
</div>
<div align='center'>
<img src="https://img.shields.io/badge/Git-F05032?style=flat&logo=Git&logoColor=white"/>
<img src="https://img.shields.io/badge/GitHub-181717?style=flat&logo=GitHub&logoColor=white"/>
<img src="https://img.shields.io/badge/Notion-000000?style=flat&logo=Notion&logoColor=white"/>
<img src="https://img.shields.io/badge/Slack-4A154B?style=flat&logo=Slack&logoColor=white"/>
<img src="https://img.shields.io/badge/Visual Studio Code-007ACC?style=flat&logo=Visual Studio Code&logoColor=white"/>
</div>

## 주요 기능

### ⭐️ 그룹 창설 및 가입으로 소규모 커뮤니티 서비스 제공

- tag 검색을 통해 원하는 성격의 그룹 조회 기능 제공
- 뉴스피드 작성을 통한 커뮤니티 활성화
- 추후 업데이트를 통해 다양한 편의성 기능 제공 예정

### ⭐️ 캘린더를 통한 일정 관리 기능

- fullcalendar 라이브러리를 이용하여 캘린더 기능 제공
- 그룹 일정 공유 기능 제공
- 추후 업데이트를 통해 다양한 편의성 기능 제공 예정

## 디렉토리 구조

```
📦src
 ┣ 📂auth
 ┃ ┣ 📂dto
 ┃ ┃ ┗ 📜auth.dto.ts
 ┃ ┣ 📂guards
 ┃ ┃ ┣ 📜jwt-auth.guard.ts
 ┃ ┃ ┣ 📜jwt-refresh.guard.ts
 ┃ ┃ ┗ 📜local-auth.guard.ts
 ┃ ┣ 📂strategy
 ┃ ┃ ┣ 📜jwt-refresh.strategy.ts
 ┃ ┃ ┣ 📜jwt.strategy.ts
 ┃ ┃ ┣ 📜kakao.strategy.ts
 ┃ ┃ ┗ 📜local.strategy.ts
 ┃ ┣ 📂utils
 ┃ ┃ ┗ 📜user.img.multer.ts
 ┃ ┣ 📜auth.controller.spec.ts
 ┃ ┣ 📜auth.controller.ts
 ┃ ┣ 📜auth.module.ts
 ┃ ┣ 📜auth.service.spec.ts
 ┃ ┗ 📜auth.service.ts
 ┣ 📂calendar
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📜groupEvent.dto.ts
 ┃ ┃ ┣ 📜updateUserEvent.dto.ts
 ┃ ┃ ┣ 📜updategroupEvent.dto.ts
 ┃ ┃ ┗ 📜userEvent.dto.ts
 ┃ ┣ 📜calendar.controller.spec.ts
 ┃ ┣ 📜calendar.controller.ts
 ┃ ┣ 📜calendar.module.ts
 ┃ ┣ 📜calendar.service.spec.ts
 ┃ ┗ 📜calendar.service.ts
 ┣ 📂common
 ┃ ┣ 📂config
 ┃ ┃ ┗ 📜typeorm.config.ts
 ┃ ┗ 📂decorator
 ┃ ┃ ┗ 📜get-user.decorator.ts
 ┣ 📂database
 ┃ ┗ 📂entities
 ┃ ┃ ┣ 📜group-newsfeed.entity.ts
 ┃ ┃ ┣ 📜group.entity.ts
 ┃ ┃ ┣ 📜groupEvent.entity.ts
 ┃ ┃ ┣ 📜newsFeed-Tag.entity.ts
 ┃ ┃ ┣ 📜newsFeed.entity.ts
 ┃ ┃ ┣ 📜newsFeedImage.entity.ts
 ┃ ┃ ┣ 📜tag-group.entity.ts
 ┃ ┃ ┣ 📜tag.entity.ts
 ┃ ┃ ┣ 📜user-group.entity.ts
 ┃ ┃ ┣ 📜user.entity.ts
 ┃ ┃ ┗ 📜userEvent.entity.ts
 ┣ 📂email
 ┃ ┣ 📜email.controller.spec.ts
 ┃ ┣ 📜email.controller.ts
 ┃ ┣ 📜email.module.ts
 ┃ ┣ 📜email.service.spec.ts
 ┃ ┗ 📜email.service.ts
 ┣ 📂group
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📜accept.group.join.dto.ts
 ┃ ┃ ┣ 📜create.group.dto.ts
 ┃ ┃ ┗ 📜modify.group.dto.ts
 ┃ ┣ 📂interface
 ┃ ┃ ┗ 📜group.transfer.interface.ts
 ┃ ┣ 📂utils
 ┃ ┃ ┗ 📜group.img.multer.ts
 ┃ ┣ 📜group.controller.spec.ts
 ┃ ┣ 📜group.controller.ts
 ┃ ┣ 📜group.module.ts
 ┃ ┣ 📜group.service.spec.ts
 ┃ ┗ 📜group.service.ts
 ┣ 📂newsfeed
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📜modinewsfeed-check.dto.ts
 ┃ ┃ ┣ 📜newsfeed-check.dto.ts
 ┃ ┃ ┣ 📜readnewsfeed-check.dto.ts
 ┃ ┃ ┗ 📜serchtagnewsfeed.dto.ts
 ┃ ┣ 📂utills
 ┃ ┃ ┗ 📜newsfeed.img.multer.ts
 ┃ ┣ 📜newsfeed.controller.spec.ts
 ┃ ┣ 📜newsfeed.controller.ts
 ┃ ┣ 📜newsfeed.module.ts
 ┃ ┣ 📜newsfeed.service.spec.ts
 ┃ ┗ 📜newsfeed.service.ts
 ┣ 📂user
 ┃ ┣ 📂dto
 ┃ ┃ ┣ 📜findPassword.dto.ts
 ┃ ┃ ┣ 📜updatePassword.dto.ts
 ┃ ┃ ┣ 📜updateUser.dto.ts
 ┃ ┃ ┗ 📜user.dto.ts
 ┃ ┣ 📜user.controller.spec.ts
 ┃ ┣ 📜user.controller.ts
 ┃ ┣ 📜user.module.ts
 ┃ ┣ 📜user.service.spec.ts
 ┃ ┗ 📜user.service.ts
 ┣ 📜app.controller.ts
 ┣ 📜app.module.ts
 ┣ 📜app.service.ts
 ┗ 📜main.ts
```
