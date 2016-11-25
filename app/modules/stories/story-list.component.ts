import { Component, OnInit }  from '@angular/core';

import { IStory } from './story';
import { StoryService } from './story.service';

import { LocalStorageService } from '../../components/angular-2-local-storage/angular-2-local-storage';

@Component({
    templateUrl: 'app/modules/stories/story-list.component.html',
    styleUrls: ['app/modules/stories/story-list.component.css']
})
export class StoryListComponent implements OnInit {
    pageTitle: string = 'Stories List';
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    //listFilter: string;
    errorMessage: string;

    

    constructor(private _storyService: StoryService, private localStorageService: LocalStorageService) {

    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }


    setNewStories(stories : IStory[]): void {
        this._storyService.stories = stories;
        var i = 0;
        for (var story of stories) {            
          this.localStorageService.set('item' + i, story);
          i = i + 1;
        }
    }   

    ngOnInit(): void {
        this._storyService.getStories()
                .subscribe(stories => this.setNewStories(stories),
                           error => this.errorMessage = <any>error);



    }

    onRatingClicked(message: string): void {
        this.pageTitle = 'Stories List: ' + message;
    }
}
