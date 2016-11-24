import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { IStory } from './story';

@Injectable()
export class StoryService {
    private _storyUrl = 'api/stories/stories.json';

    constructor(private _http: Http) { }

    getStories(): Observable<IStory[]> {
        return this._http.get(this._storyUrl)
            .map((response: Response) => <IStory[]> response.json())
            .do(data => console.log('All: ' +  JSON.stringify(data)))
            .catch(this.handleError);
    }

    getStory(id: number): Observable<IStory> {
        return this.getStories()
            .map((stories: IStory[]) => stories.find(p => p.Id === id));
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
