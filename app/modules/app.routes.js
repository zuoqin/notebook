System.register(['@angular/router', './homepage/homepage.component', './storieslist/storieslist.component'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var router_1, homepage_component_1, storieslist_component_1;
    var routes, appRouterProviders;
    return {
        setters:[
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (homepage_component_1_1) {
                homepage_component_1 = homepage_component_1_1;
            },
            function (storieslist_component_1_1) {
                storieslist_component_1 = storieslist_component_1_1;
            }],
        execute: function() {
            routes = [
                { path: '', component: storieslist_component_1.StoriesListComponent },
                { path: 'home', component: homepage_component_1.HomeComponent }
            ];
            exports_1("appRouterProviders", appRouterProviders = [
                router_1.provideRouter(routes)
            ]);
        }
    }
});
//# sourceMappingURL=app.routes.js.map