import {Component} from 'angular2/core';
import {StoryService} from './Services/storyService';
import {HTTP_PROVIDERS} from 'angular2/http';


import {RouteConfig, RouterOutlet} from 'angular2/router';
import {StoryComponent} from './story.component';
import {ListComponent} from './list.component';
import {LocalService} from "./Services/localService";

interface Image{
    _id: string;
    contentType: string;
    data: string;
    weiboid: string;
}

interface Story {
    title: string;
    introduction: string;
    modified: Date;
    created: Date;
    content: string;
    _id: string;
    creator: string;
    images: Array<Image>;
}

@RouteConfig([
    {path: '/story', name: 'Story', component: StoryComponent},
    //{path: '/user', name: 'User', component: UserComponent}
    {path: '/list', name: 'List', component: ListComponent, useAsDefault: true},
    {path: '/*other', name: 'Other', redirectTo:['List']}
])

@Component({
    selector: 'my-app',
    templateUrl: `/app/app.component.html`,
    providers: [HTTP_PROVIDERS, StoryService,LocalService],
    directives: [RouterOutlet]
})



export class AppComponent {

    //OnGetStory(story){
    //    var theStories : Array<Story>  = JSON.parse(story._body);
    //    console.log(theStories[0].title);
    //}
    //
    //onRetrieveItem(element, index, array){
    //    this._storyService.getbyid(element)
    //        .subscribe(item=>this.OnGetStory(item));
    //}
    //
    //onReceiveIDs(ids){
    //    var IDs = JSON.parse(ids._body);
    //    for(var index = 0; index < IDs.data.length; ++index)
    //    {
    //      this.onRetrieveItem(IDs.data[index], index, IDs);
    //    }
    //IDs.data.forEach(this.onRetrieveItem.bind(this));
    //console.log(IDs.data);
    //}
    constructor(private _localService:LocalService){ //} _storyService: StoryService){
        //this._storyService = _storyService;
        //_storyService.getFromTime(null)
        //    .subscribe(ids=>this.onReceiveIDs(ids));
        this._localService = _localService;
        //var story : Story = {
        //    title: 'nw tutle',
        //    introduction: 'new intro',
        //    modified: new Date,
        //    created: new Date,
        //    content: 'content',
        //    _id: '5555',
        //    creator: '777',
        //    images: []};
        //_localService.insert(story);
        var story : Story = _localService.getbyid('55c7f92ed50637bf737ee3d1');
        console.log(story.title);
    }
}