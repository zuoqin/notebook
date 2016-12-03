import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

@Injectable()
export class StoryDetailGuard implements CanActivate {

    constructor(private _router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        let id = route.url[1].path;
        if ( id.length < 1) {
            alert('Invalid story Id');
            // start a new navigation to redirect to list page
            this._router.navigate(['/stories']);
            // abort current navigation
            return false;
        };
        return true;
    }
}
