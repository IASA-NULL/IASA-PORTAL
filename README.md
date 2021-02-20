## IASA PORTAL

TS + Node.js + React + MongoDB로 만든 IASA PORTAL입니다.

## 사용법

### 설치하기

1. 프로젝트를 클론합니다.
1. secret 폴더를 루트에 복사합니다.
1. MongoDB에 ID가 portal인 계정을 생성합니다. 비밀번호는 secret의 db 파일의 내용과 일치하게 합니다.

### 시작하기

1. `npm run build`로 파일을 빌드합니다.
1. `npm run start`로 express 서버를 시작합니다.

## TODO

-   [X] 가입메일 전송 시스템
-   [X] 가입
-   [ ] 면불
-   [X] 마이페이지
-   [ ] File Splitting
-   [ ] Docker + Cloud(EC2)
-   [X] 벌점
-   [X] 메인 페이지
-   [X] 업로드 시스템 구현(S3)
-   [X] IASA-PRINT integration

## TODO(나중에)

-   [ ] GraphQL
-   [ ] PREACT
-   [ ] deno?
-   [ ] 클라우드 업체 Azure로 변경?
