import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent }  from './app.component';

/* Feature Modules */
import { StoryModule } from './stories/story.module';

@NgModule({
  imports: [
    BrowserModule,
    HttpModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'stories', pathMatch: 'full' },
      { path: '**', redirectTo: 'stories', pathMatch: 'full' }
    ]),
    StoryModule
  ],
  declarations: [
    AppComponent
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
