import { Component, OnInit }  from '@angular/core';

import { IStory } from './story';
import { StoryService } from './story.service';

@Component({
    templateUrl: 'app/modules/stories/story-list.component.html',
    styleUrls: ['app/modules/stories/story-list.component.css']
})
export class StoryListComponent implements OnInit {
    pageTitle: string = 'Stories List';
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    listFilter: string;
    errorMessage: string;

    stories: IStory[];

    constructor(private _storyService: StoryService) {

    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }

    ngOnInit(): void {
        this._storyService.getStories()
                .subscribe(stories => this.stories = stories,
                           error => this.errorMessage = <any>error);
    }

    onRatingClicked(message: string): void {
        this.pageTitle = 'Stories List: ' + message;
    }
}
