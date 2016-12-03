import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

import { IStory } from './story';

import { LocalStorageService } from 'angular-2-local-storage';
import {AngularIndexedDB} from '../components/angular2-indexeddb';

@Injectable()
export class StoryService {
    private _storyUrl = 'api/stories/stories.json';
    listFilter: string;
    db: AngularIndexedDB;
    stories: IStory[];
    
    constructor(private _http: Http, private localStorageService: LocalStorageService) { 
    }


    getIndexedDB(db:AngularIndexedDB):Observable<IStory[]>{
        var headers = new Headers();
        headers.append("x-access-token", "111");

        return Observable.create(observer => {
            this.db.getAll('stories').then((stories) => {

                if(stories === undefined || stories === null || stories.length === 0){
                    this._http.get(this._storyUrl, {headers: headers})
                        .map((response: Response) => <IStory[]> response.json())
                        .subscribe((result) => {
                            //do something with result. 
                            this.stories = result;
                            observer.next(this.stories);
                            //call complete if you want to close this stream (like a promise)
                            observer.complete();
                        });
                }
                else{
                    observer.next(stories);
                    observer.complete();
                }

            }, (error) => {
                console.log(error);
            });

        });
        


              
        //return new Observable<IStory[]>((subscriber: Subscriber<IStory[]>) => subscriber.next(this.stories)).map(o => o);
    }

    getStories(db: AngularIndexedDB): Observable<IStory[]> {
        var headers = new Headers();
        headers.append("x-access-token", "111");
        this.db = db;
        this.localStorageService.set('token', '2222');
        //let db = new AngularIndexedDB('myDb', 1);
        // db.add( 'people', {name: 'name', email: 'email'}, 1).then(() => {
        //     // Do something after the value was added





        return this.getIndexedDB(db);
                // .subscribe(stories => this.stories = stories,
                //            error => console.log(error));



        //return this.getIndexedDB(db);
        // var i = this.stories.length;

        // if( i === 0 ){
        //     return this._http.get(this._storyUrl, {headers: headers})
        //         .map((response: Response) => <IStory[]> response.json())
        //         //.do(data => console.log('All: ' +  JSON.stringify(data)))
        //         .catch(this.handleError);
        // }
        // else{
        //     return new Observable<IStory[]>((subscriber: Subscriber<IStory[]>) => subscriber.next(this.stories)).map(o => o);
        // }   
    }

    //getStories(): Observable<IStory[]>{
    //    //let db = new AngularIndexedDB('myDb', 1);
    //}

    getStory(id: string): Observable<IStory> {
        return this.getStories(this.db)
            .map((stories: IStory[]) => stories.find(p => p._id === id));
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error');
    }
}
