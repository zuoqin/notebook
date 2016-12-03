import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';
import { StoryModule } from './stories/story.module';
import { StoryListComponent } from './stories/story-list.component';

import { DataResolver } from './app.resolver';


export const ROUTES: Routes = [
  { path: 'stories', component: StoryListComponent },
  { path: '',      component: StoryListComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  
  {
    path: 'detail', loadChildren: () => System.import('./+detail')
      .then((comp: any) => comp.default),
  },
  { path: '**',    component: NoContentComponent },
];
