import {bootstrap} from '@angular/platform-browser-dynamic';
import 'rxjs/Rx';

import { appRouterProviders } from './app.routes';

//import {Component} from '@angular/core';
//import {StoryService} from './Services/storyService';
//import {HTTP_PROVIDERS} from 'angular2/http';


//import {RouteConfig, RouterOutlet} from 'angular2/router';
//import {StoryComponent} from './story.component';
import {HomeComponent} from './homepage/homepage.component';
//import {LocalService} from "./Services/localService";


bootstrap(HomeComponent, [
  appRouterProviders
]);