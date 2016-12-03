import { Component, OnInit }  from '@angular/core';

import { IStory } from './story';
import { StoryService } from './story.service';

import { LocalStorageService } from 'angular-2-local-storage';
import {AngularIndexedDB} from '../components/angular2-indexeddb';


@Component({
    templateUrl: './story-list.component.html',
    styleUrls: ['./story-list.component.css']
})
export class StoryListComponent implements OnInit {
    pageTitle: string = 'Stories List';
    imageWidth: number = 50;
    imageMargin: number = 2;
    showImage: boolean = false;
    db: AngularIndexedDB;
    errorMessage: string;

    objectStore : any;

    constructor(private _storyService: StoryService, private localStorageService: LocalStorageService) {

    }

    toggleImage(): void {
        this.showImage = !this.showImage;
    }


    setNewStories(stories : IStory[]): void {
        this._storyService.stories = stories;
        var i = 0;
        for (var story of stories) {            
            //this.localStorageService.set('item' + i, story);

            this.db.add( 'stories', story, 'item' + i).then(() => {
            // Do something after the value was added


         
            }, (error) => {
                console.log(error);
            });
            i = i + 1;
        }
    };

    ngOnInit(): void {
        this.db = new AngularIndexedDB('myDb', 1);
        this.objectStore = this.db.createStore(1, (evt) => {
            let objectStore = evt.currentTarget.result.createObjectStore(
                'stories', {autoIncrement: false} )
        })
        .then( () =>
        {

            console.log('kjhkhkjhkj');
            //this.objectStore.createIndex("name", "name", { unique: false });
            //this.objectStore.createIndex("email", "email", { unique: true });


            this._storyService.getStories(this.db)
                    .subscribe(stories => this.setNewStories(stories),
                               error => this.errorMessage = <any>error);
        }
        );
    };

    onRatingClicked(message: string): void {
        this.pageTitle = 'Stories List: ' + message;
    }
}
