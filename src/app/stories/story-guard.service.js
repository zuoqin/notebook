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
var StoryDetailGuard = (function () {
    function StoryDetailGuard(_router) {
        this._router = _router;
    }
    StoryDetailGuard.prototype.canActivate = function (route) {
        var id = route.url[1].path;
        if (id.length < 1) {
            alert('Invalid story Id');
            // start a new navigation to redirect to list page
            this._router.navigate(['/stories']);
            // abort current navigation
            return false;
        }
        ;
        return true;
    };
    StoryDetailGuard = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [router_1.Router])
    ], StoryDetailGuard);
    return StoryDetailGuard;
}());
exports.StoryDetailGuard = StoryDetailGuard;
//# sourceMappingURL=story-guard.service.js.map