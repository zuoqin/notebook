import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Subscription }       from 'rxjs/Subscription';

import { IStory } from './story';
import { StoryService } from './story.service';

@Component({
    templateUrl: 'app/modules/stories/story-detail.component.html'
})
export class StoryDetailComponent implements OnInit, OnDestroy {
    pageTitle: string = 'Story Detail';
    story: IStory;
    errorMessage: string;
    private sub: Subscription;

    constructor(private _route: ActivatedRoute,
                private _router: Router,
                private _storyService: StoryService) {
    }

    ngOnInit(): void {
        this.sub = this._route.params.subscribe(
            params => {
                let id = params['id'];
                this.getStory(id);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    getStory(id: string) {
        this._storyService.getStory(id).subscribe(
            story => this.story = story,
            error => this.errorMessage = <any>error);
    }

    onBack(): void {
        this._router.navigate(['/stories']);
    }

    onRatingClicked(message: string): void {
        this.pageTitle = 'Story Detail: ' + message;
    }
}
