import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRouting } from '@angular/ssr';  // ✅ Correct SSR function
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRouting(serverRoutes)  // ✅ Use correct SSR routing provider
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
