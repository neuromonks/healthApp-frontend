import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  endpoint: string = 'http://localhost:8000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');
  currentUser = {};

  constructor(
    private http: HttpClient,
    public router: Router
  ) {

  }

  signUp(user:any): Observable<any> {
    let api = `${this.endpoint}/register`;
    return this.http.post(api, user)
      .pipe(
        catchError(this.handleError)
      )
  }


  loggedIn(user:any) {
        localStorage.setItem('userDetails',JSON.stringify(user));
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  get isLoggedIn(): boolean {
    let userDetails = localStorage.getItem('userDetails');
    return (userDetails !== null) ? true : false;
  }

  isAdmin(){
    let authToken = localStorage.getItem('userDetails');
    if(authToken !== null){
      let userDetails = JSON.parse(localStorage.getItem('userDetails'));
      if(userDetails.hasOwnProperty('is_admin')){
        return userDetails['is_admin'];
      }
    }else{
      this.router.navigate(['login']);
    }
  }

  getUserId(){
    let authToken = localStorage.getItem('userDetails');
    if(authToken !== null){
      let userDetails = JSON.parse(localStorage.getItem('userDetails'));
      if(userDetails.hasOwnProperty('customer_id')){
        return userDetails['customer_id'];
      }else{
        this.router.navigate(['login']);
      }
    }else{
      this.router.navigate(['login']);
    }
  }

  isMobileVerified(){
    let authToken = localStorage.getItem('userDetails');
    if(authToken !== null){
      let userDetails = JSON.parse(localStorage.getItem('userDetails'));
      if(userDetails.hasOwnProperty('is_mobile_verified')){
        return userDetails['is_mobile_verified']=='0'?false:true;
      }else{
        this.router.navigate(['login']);
      }
    }else{
      this.router.navigate(['login']);
    }
  }
  getUserInfo(){
    let authToken = localStorage.getItem('userDetails');
    if(authToken !== null){
      let userDetails = JSON.parse(localStorage.getItem('userDetails'));
        return userDetails;
    }else{
      this.router.navigate(['login']);
    }
  }
  logout() {
    let removeToken = localStorage.removeItem('access_token');
    let removeUser = localStorage.removeItem('userDetails');
    if (removeToken == null) {
      this.router.navigate(['login']);
      console.log('logged out');
    }
  }


   // Error
   handleError(error: HttpErrorResponse) {
    let msg = '';
    if (error.error instanceof ErrorEvent) {
      // client-side error
      msg = error.error.message;
    } else {
      // server-side error
      msg = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(msg);
  }
}
