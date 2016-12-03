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
var story_list_component_1 = require('./story-list.component');
var story_detail_component_1 = require('./story-detail.component');
var story_guard_service_1 = require('./story-guard.service');
var story_filter_pipe_1 = require('./story-filter.pipe');
var story_service_1 = require('./story.service');
var shared_module_1 = require('../shared/shared.module');
var StoryModule = (function () {
    function StoryModule() {
    }
    StoryModule = __decorate([
        core_1.NgModule({
            imports: [
                shared_module_1.SharedModule,
                router_1.RouterModule.forChild([
                    { path: 'stories', component: story_list_component_1.StoryListComponent },
                    { path: 'story/:id',
                        canActivate: [story_guard_service_1.StoryDetailGuard],
                        component: story_detail_component_1.StoryDetailComponent
                    }
                ])
            ],
            declarations: [
                story_list_component_1.StoryListComponent,
                story_detail_component_1.StoryDetailComponent,
                story_filter_pipe_1.StoryFilterPipe
            ],
            providers: [
                story_service_1.StoryService,
                story_guard_service_1.StoryDetailGuard
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], StoryModule);
    return StoryModule;
}());
exports.StoryModule = StoryModule;
//# sourceMappingURL=story.module.js.map