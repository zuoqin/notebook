import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';


import { FormsModule } from '@angular/forms';
import { AppComponent }  from './app.component';

import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from '../components/angular-2-local-storage/angular-2-local-storage';

/* Feature Modules */
import { StoryModule } from './stories/story.module';

// Create config options (see ILocalStorageServiceConfigOptions) for deets:
let localStorageServiceConfig = {
    prefix: 'my-app',
    storageType: 'localStorage'
};


@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'stories', pathMatch: 'full' },
      { path: '**', redirectTo: 'stories', pathMatch: 'full' }
    ]),
    StoryModule,
    FormsModule,
  ],
  declarations: [
    AppComponent
  ],
  providers: [
      LocalStorageService,
      {
          provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
      }
  ],  
  bootstrap: [ AppComponent ]
})
export class AppModule { }
