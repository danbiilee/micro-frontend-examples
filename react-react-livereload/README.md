# React - React

## Getting Started

```bash
yarn && cd host && yarn && cd ../app1 && yarn && cd ../app2 && yarn && cd ../ && yarn start
```

- Host
  - `./host`: localhost:3000
- Remote
  - `./app1`: localhost:3001
  - `./app2`: localhost:3002

## HMR

- `webpack-dev-server` 옵션 사용
- Host는 HMR 안 됨
- Remote 여러 개 통합할 시 에러 발생
