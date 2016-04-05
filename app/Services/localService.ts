/**
 * Created by zuoqin on 4/5/2016.
 */
import {Injectable} from 'angular2/core';
import {AngularIndexedDB} from '../../components/angular2-indexeddb/angular2-indexeddb';
import 'rxjs/Observable';



@Injectable()
export class LocalService{
    _db : AngularIndexedDB = new AngularIndexedDB('journalitems', 1);
    constructor(){
        console.log('jkhkjhkj')
        //this._db.createStore(1, (evt) => {
        //    let objectStore = evt.currentTarget.result.createObjectStore(
        //        'items', { keyPath: "_id", autoIncrement: false });
        //
        //});
    };


    getbyid(id){
        console.log('in get by id');
        //this._db.getByKey('items', 1).then((item) => {
        //    console.log(item);
        //}, (error) => {
        //    console.log(error);
        //});
    };

    insert(story){
        console.debug(story.title);

        //this._db.add('item', { _id:1, name: 'name', email: 'email' }, '_id').then(() => {
        //    // Do something after the value was added
        //}, (error) => {
        //    console.log(error);
        //});
    };
}