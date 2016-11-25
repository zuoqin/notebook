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
var platform_browser_1 = require('@angular/platform-browser');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
var forms_1 = require('@angular/forms');
var app_component_1 = require('./app.component');
var angular_2_local_storage_1 = require('../components/angular-2-local-storage/angular-2-local-storage');
/* Feature Modules */
var story_module_1 = require('./stories/story.module');
// Create config options (see ILocalStorageServiceConfigOptions) for deets:
var localStorageServiceConfig = {
    prefix: 'my-app',
    storageType: 'localStorage'
};
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                http_1.HttpModule,
                router_1.RouterModule.forRoot([
                    { path: '', redirectTo: 'stories', pathMatch: 'full' },
                    { path: '**', redirectTo: 'stories', pathMatch: 'full' }
                ]),
                story_module_1.StoryModule,
                forms_1.FormsModule,
            ],
            declarations: [
                app_component_1.AppComponent
            ],
            providers: [
                angular_2_local_storage_1.LocalStorageService,
                {
                    provide: angular_2_local_storage_1.LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
                }
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map