# React - React

## Getting Started

```bash
npm i -g lerna
yarn bootstrap && yarn start
```

- Host
  - `./host`: localhost:3000
- Remote
  - `./remotes/app1`: localhost:3001
  - `./remotes/app2`: localhost:3002

## Features

- live reloading: `@module-federation/fmr` 사용
- 모노레포 적용: Yarn Workspace + Lerna
- shared 패키지: Remote app1에서 사용
- 테스트 배포: https://micro-host.netlify.app/
