import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { IStory } from './story';

import { LocalStorageService } from '../../components/angular-2-local-storage/angular-2-local-storage';

@Injectable()
export class StoryService {
    private _storyUrl = 'api/stories/stories.json';
    listFilter: string;

    stories: IStory[];

    constructor(private _http: Http, private localStorageService: LocalStorageService) { }

    getStories(): Observable<IStory[]> {
        var headers = new Headers();
        headers.append("x-access-token", "111");

        this.localStorageService.set('token', '2222');


        var i = 0;
        while(true){
            var story = this.localStorageService.get('item' + i);
            if(story === undefined || story === null){
                break;
            }
            i = i + 1;
            if(this.stories === undefined || this.stories === null){
                this.stories = new Array(0);
            }
            this.stories.push(story);
        }
        if( i === 0 ){
            return this._http.get(this._storyUrl, {headers: headers})
                .map((response: Response) => <IStory[]> response.json())
                //.do(data => console.log('All: ' +  JSON.stringify(data)))
                .catch(this.handleError);
        }
        else{
            return new Observable<IStory[]>((subscriber: Subscriber<IStory[]>) => subscriber.next(this.stories)).map(o => o);
        }
    }

    //getStories(): Observable<IStory[]>{
    //    //let db = new AngularIndexedDB('myDb', 1);
    //}

    getStory(id: string): Observable<IStory> {
        return this.getStories()
            .map((stories: IStory[]) => stories.find(p => p._id === id));
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
