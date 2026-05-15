import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { BrowserModule, provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { provideToastr, ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';



export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(),
    provideBrowserGlobalErrorListeners(),
    importProvidersFrom(BrowserModule, ToastrModule.forRoot()),
    provideToastr(),
    provideAnimations(),
  ]
};