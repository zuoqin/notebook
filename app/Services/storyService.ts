/**
 * Created by zuoqin on 4/3/2016.
 */
import {Injectable} from 'angular2/core';
import {Http,Headers} from 'angular2/http';
import 'rxjs/Observable';

@Injectable()
export class StoryService{

    private _url = "http://zuoqin.t5p.hk:3000/api";

    constructor(private _http : Http){}


    getbyid(id){

        var headers = new Headers();
        headers.append('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NWM1ZTg5OTMxNWMxODEyMWEwYTFiZWEiLCJuYW1lIjoienVvcWluIiwidXNlcm5hbWUiOiJ6dW9xaW4iLCJpYXQiOjE0NTk1NzY1MTJ9.163Q3_Uz7KBQwixyTrx_qD_duNXkVrdK8wZgi7hV3To');
        headers.append('Content-Type', 'application/json;charset=UTF-8');

        return this._http.get(this._url+ '?id=' + id, {headers:headers});
    };

     getFromTime(datetime){
         if (datetime === null || datetime === undefined) {
             datetime = new Date(0);
         }
         console.debug(datetime);

         var data = {datetime:datetime};


         var headers = new Headers();
         headers.append('x-access-token', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJfaWQiOiI1NWM1ZTg5OTMxNWMxODEyMWEwYTFiZWEiLCJuYW1lIjoienVvcWluIiwidXNlcm5hbWUiOiJ6dW9xaW4iLCJpYXQiOjE0NTk1NzY1MTJ9.163Q3_Uz7KBQwixyTrx_qD_duNXkVrdK8wZgi7hV3To');
         headers.append('Content-Type', 'application/json;charset=UTF-8');


         return this._http.post(this._url,JSON.stringify(data), {headers:headers});
     };
}