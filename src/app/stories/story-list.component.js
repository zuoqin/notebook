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
var story_service_1 = require('./story.service');
var angular_2_local_storage_1 = require('../../components/angular-2-local-storage/angular-2-local-storage');
var StoryListComponent = (function () {
    function StoryListComponent(_storyService, localStorageService) {
        this._storyService = _storyService;
        this.localStorageService = localStorageService;
        this.pageTitle = 'Stories List';
        this.imageWidth = 50;
        this.imageMargin = 2;
        this.showImage = false;
    }
    StoryListComponent.prototype.toggleImage = function () {
        this.showImage = !this.showImage;
    };
    StoryListComponent.prototype.setNewStories = function (stories) {
        this._storyService.stories = stories;
        var i = 0;
        for (var _i = 0, stories_1 = stories; _i < stories_1.length; _i++) {
            var story = stories_1[_i];
            this.localStorageService.set('item' + i, story);
            i = i + 1;
        }
    };
    StoryListComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._storyService.getStories()
            .subscribe(function (stories) { return _this.setNewStories(stories); }, function (error) { return _this.errorMessage = error; });
    };
    StoryListComponent.prototype.onRatingClicked = function (message) {
        this.pageTitle = 'Stories List: ' + message;
    };
    StoryListComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/modules/stories/story-list.component.html',
            styleUrls: ['app/modules/stories/story-list.component.css']
        }), 
        __metadata('design:paramtypes', [story_service_1.StoryService, angular_2_local_storage_1.LocalStorageService])
    ], StoryListComponent);
    return StoryListComponent;
}());
exports.StoryListComponent = StoryListComponent;
//# sourceMappingURL=story-list.component.js.map