declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production';
    readonly PUBLIC_URL: string;
    readonly MANAGENT_MF_NAME_APP1: string;
    readonly MANAGENT_MF_NAME_APP2: string;
  }
}
