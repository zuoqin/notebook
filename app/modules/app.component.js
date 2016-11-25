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
var story_service_1 = require('./stories/story.service');
var AppComponent = (function () {
    function AppComponent(_storyService) {
        this._storyService = _storyService;
        this.pageTitle = 'Items';
    }
    AppComponent.prototype.onDownload = function () {
        var _this = this;
        this._storyService.getStories()
            .subscribe(function (stories) { return _this._storyService.stories = stories; }, function (error) { return _this.errorMessage = error; });
    };
    AppComponent.prototype.onUpload = function () {
        //this._storyService.postStories()
        //        .subscribe(stories => this._storyService.stories = stories,
        //                   error => this.errorMessage = <any>error);
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'pm-app',
            styleUrls: ['app/modules/stories/story-list.component.css'],
            template: "\n    <div>\n        <nav class='navbar navbar-default'>\n            <div class='container-fluid'>\n                <a class='navbar-brand'>{{pageTitle}}</a>\n                <ul class='nav navbar-nav'>\n                    <li><a [routerLink]=\"['/welcome']\">Home</a></li>\n                    <li><a [routerLink]=\"['/products']\">Product List</a></li>\n                </ul>\n\n                <div role=\"navigation\" class=\"pull-right\">\n\n                        <ul class='nav navbar-nav navbar-right'>\n                            <li>\n                                <input style=\"margin-top: 10px;\" placeholder=\"Search\" type=\"text\" maxlength=\"120\" [(ngModel)]='_storyService.listFilter'/>                                \n                            </li>\n                            <li>\n                                <button class=\"btndownload\" (click)='onDownload()'>\n                                </button>\n                            </li>\n                            <li>\n                                <button class=\"btnupload\" (click)='onUpload()'>\n                                </button>\n                            </li>\n                        </ul>\n\n                </div>        \n            </div>\n        </nav>\n        <div class='container'>\n            <router-outlet></router-outlet>\n        </div>\n     </div>\n     "
        }), 
        __metadata('design:paramtypes', [story_service_1.StoryService])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map