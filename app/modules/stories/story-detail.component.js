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
var router_1 = require('@angular/router');
var story_service_1 = require('./story.service');
var StoryDetailComponent = (function () {
    function StoryDetailComponent(_route, _router, _storyService) {
        this._route = _route;
        this._router = _router;
        this._storyService = _storyService;
        this.pageTitle = 'Story Detail';
    }
    StoryDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this._route.params.subscribe(function (params) {
            var id = +params['id'];
            _this.getStory(id);
        });
    };
    StoryDetailComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    StoryDetailComponent.prototype.getStory = function (id) {
        var _this = this;
        this._storyService.getStory(id).subscribe(function (story) { return _this.story = story; }, function (error) { return _this.errorMessage = error; });
    };
    StoryDetailComponent.prototype.onBack = function () {
        this._router.navigate(['/stories']);
    };
    StoryDetailComponent.prototype.onRatingClicked = function (message) {
        this.pageTitle = 'Story Detail: ' + message;
    };
    StoryDetailComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/modules/stories/story-detail.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.ActivatedRoute, router_1.Router, story_service_1.StoryService])
    ], StoryDetailComponent);
    return StoryDetailComponent;
}());
exports.StoryDetailComponent = StoryDetailComponent;
//# sourceMappingURL=story-detail.component.js.map