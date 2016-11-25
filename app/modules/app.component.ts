import { Component } from '@angular/core';
import { StoryService } from './stories/story.service';
import { SharedModule } from './shared/shared.module';

@Component({
    selector: 'pm-app',
    styleUrls: ['app/modules/stories/story-list.component.css'],
    template: `
    <div>
        <nav class='navbar navbar-default'>
            <div class='container-fluid'>
                <a class='navbar-brand'>{{pageTitle}}</a>
                <ul class='nav navbar-nav'>
                    <li><a [routerLink]="['/welcome']">Home</a></li>
                    <li><a [routerLink]="['/products']">Product List</a></li>
                </ul>

                <div role="navigation" class="pull-right">

                        <ul class='nav navbar-nav navbar-right'>
                            <li>
                                <input style="margin-top: 10px;" placeholder="Search" type="text" maxlength="120" [(ngModel)]='_storyService.listFilter'/>                                
                            </li>
                            <li>
                                <button class="btndownload" (click)='onDownload()'>
                                </button>
                            </li>
                            <li>
                                <button class="btnupload" (click)='onUpload()'>
                                </button>
                            </li>
                        </ul>

                </div>        
            </div>
        </nav>
        <div class='container'>
            <router-outlet></router-outlet>
        </div>
     </div>
     `
})
export class AppComponent {
    constructor(private _storyService: StoryService) {

    }

    errorMessage: string;


    onDownload(): void {
        this._storyService.getStories()
                .subscribe(stories => this._storyService.stories = stories,
                           error => this.errorMessage = <any>error);
    }    

    onUpload(): void {
        //this._storyService.postStories()
        //        .subscribe(stories => this._storyService.stories = stories,
        //                   error => this.errorMessage = <any>error);
    }   
    pageTitle: string = 'Items';
}
