/**
 * Created by zuoqin on 4/5/2016.
 */
import {Component} from 'angular2/core';
import {LocalService} from './Services/localService';

@Component({
    template: `
        <h1>Stories</h1>
        <div *ngIf="isLoading">
            <i class="fa fa-spinner fa-spin fa-3x"></i>
        </div>
        <ul>
            <li *ngFor="#story of stpries">
                {{ story.title }}
            </li>
        </ul>
    `
})
export class ListComponent {
    isLoading = true;
    list;

    //constructor(private _localService: LocalService){
    //}
    //
    //ngOnInit(){
    //    this._photoService.getAlbums()
    //        .subscribe(albums => {
    //            this.isLoading = false;
    //            this.albums = albums;
    //        });
    //}
}