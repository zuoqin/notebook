System.register(['@angular/platform-browser-dynamic', 'rxjs/Rx', './app.routes', './homepage/homepage.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var platform_browser_dynamic_1, app_routes_1, homepage_component_1;
    return {
        setters:[
            function (platform_browser_dynamic_1_1) {
                platform_browser_dynamic_1 = platform_browser_dynamic_1_1;
            },
            function (_1) {},
            function (app_routes_1_1) {
                app_routes_1 = app_routes_1_1;
            },
            function (homepage_component_1_1) {
                homepage_component_1 = homepage_component_1_1;
            }],
        execute: function() {
            //import {LocalService} from "./Services/localService";
            platform_browser_dynamic_1.bootstrap(homepage_component_1.HomeComponent, [
                app_routes_1.appRouterProviders
            ]);
        }
    }
});
//# sourceMappingURL=app.module.js.map