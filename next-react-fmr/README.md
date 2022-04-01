# Next(Host) - React(Remote)

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

- `@module-federation/fmr` 사용
- live reloading O / HMR X
- app1, app2 화면에서도 HMR 안됨
