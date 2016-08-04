import {Component} from '@angular/core';
//import {StoriesListComponent} from '../storieslist/storieslist.component';
import { ROUTER_DIRECTIVES } from '@angular/router';


@Component({
  selector: 'my-app',
  templateUrl: 'app/modules/homepage/homepage.html',
  directives: [ROUTER_DIRECTIVES] //here
})



export class HomeComponent{
  ngOnInit() {
    // Properties are resolved and things like
    // this.mapWindow and this.mapControls
    // had a chance to resolve from the
    // two child components <map-window> and <map-controls>
    console.log('hhhh');
    $('#main-menu').smartmenus();
  }  
}