"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
require('rxjs/add/operator/do');
require('rxjs/add/operator/catch');
require('rxjs/add/operator/map');
var angular_2_local_storage_1 = require('../../components/angular-2-local-storage/angular-2-local-storage');
var StoryService = (function () {
    function StoryService(_http, localStorageService) {
        this._http = _http;
        this.localStorageService = localStorageService;
        this._storyUrl = 'api/stories/stories.json';
    }
    StoryService.prototype.getStories = function () {
        var _this = this;
        var headers = new http_1.Headers();
        headers.append("x-access-token", "111");
        this.localStorageService.set('token', '2222');
        var i = 0;
        while (true) {
            var story = this.localStorageService.get('item' + i);
            if (story === undefined || story === null) {
                break;
            }
            i = i + 1;
            if (this.stories === undefined || this.stories === null) {
                this.stories = new Array(0);
            }
            this.stories.push(story);
        }
        if (i === 0) {
            return this._http.get(this._storyUrl, { headers: headers })
                .map(function (response) { return response.json(); })
                .catch(this.handleError);
        }
        else {
            return new Observable_1.Observable(function (subscriber) { return subscriber.next(_this.stories); }).map(function (o) { return o; });
        }
    };
    //getStories(): Observable<IStory[]>{
    //    //let db = new AngularIndexedDB('myDb', 1);
    //}
    StoryService.prototype.getStory = function (id) {
        return this.getStories()
            .map(function (stories) { return stories.find(function (p) { return p._id === id; }); });
    };
    StoryService.prototype.handleError = function (error) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable_1.Observable.throw(error.json().error || 'Server error');
    };
    StoryService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http, angular_2_local_storage_1.LocalStorageService])
    ], StoryService);
    return StoryService;
}());
exports.StoryService = StoryService;
//# sourceMappingURL=story.service.js.map