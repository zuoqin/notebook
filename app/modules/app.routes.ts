import { provideRouter, RouterConfig } from '@angular/router';
import {HomeComponent} from './homepage/homepage.component';
import {StoriesListComponent} from './storieslist/storieslist.component';

const routes: RouterConfig = [
  { path: '', component: StoriesListComponent },
  { path: 'home', component: HomeComponent }
];

export const appRouterProviders = [
  provideRouter(routes)
];