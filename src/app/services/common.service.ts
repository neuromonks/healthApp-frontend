import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders,HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Router} from '@angular/router';
import { Location } from '@angular/common';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
// import { filter } from 'rxjs/add/operator/filter';
// import { map } from 'rxjs/add/operator/map';

// import 'rxjs/add/operator/filter'
// import 'rxjs/add/operator/map'




const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(
    private http:HttpClient,
    private router: Router,
    private location: Location ) { }
  private _handler: Subject<Object> = new Subject<Object>();

  boradcast(type: string, payload: any = null) {
    this._handler.next({ type, payload });
  }

  subscribe(type: string, callback: (payload: any) => void): Subscription {
    return this._handler
      .subscribe(callback);
  }

  loader(value:boolean){
    this.boradcast('loader',value);
  }

  apiCall(type:string,url:string,body={},header={}){

    url='http://127.0.0.1:5000/'+url;
    switch(type.toLowerCase()){
      case 'get':{
        return this.http.get(url,body);
      }
      case 'post':{
        return this.http.post(url,body);
      }
      case 'put':{
        return this.http.put(url,body);
      }
      case 'delete':{
        return this.http.delete(url);
      }
    }
  }

  navigateTo(url) {
   this.router.navigateByUrl(url);
  }

  isMobile(){
    if(window.innerWidth <= 786){
      return true;
    }
    return false;
  }

  navigateBack(){
    this.location.back();
  }
}
