import {Component} from 'angular2/core';
import {StoryService} from './Services/storyService';
import {HTTP_PROVIDERS} from 'angular2/http';

interface Story {
    title: string;
    introduction: string;
    modified: Date;
    created: Date;
    content: string;
    _id: string;
    creator: string;
    images: Array;
}

@Component({
    selector: 'my-app',
    template: `<h1>My First Angular 2 App</h1>`,
    providers: [HTTP_PROVIDERS, StoryService]
})



export class AppComponent {
    private _storyService: StoryService;

    OnGetStory(story){
        var theStories : Array<Story>  = JSON.parse(story._body);
        console.log(theStories[0].title);
    }

    onRetrieveItem(element, index, array){
        this._storyService.getbyid(element)
            .subscribe(item=>this.OnGetStory(item));
    }

    onReceiveIDs(ids){
        var IDs = JSON.parse(ids._body);
        for(var index = 0; index < IDs.data.length; ++index)
        {
          this.onRetrieveItem(IDs.data[index], index, IDs);
        }
        //IDs.data.forEach(this.onRetrieveItem.bind(this));
        //console.log(IDs.data);
    }
    constructor(private _storyService: StoryService){
        this._storyService = _storyService;
        _storyService.getFromTime(null)
            .subscribe(ids=>this.onReceiveIDs(ids));
    }
}