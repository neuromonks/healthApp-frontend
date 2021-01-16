import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from "@angular/common/http";
import { AuthService } from "./auth.service";
import { Observable } from 'rxjs';
import 'rxjs/add/operator/catch';
import { CommonService } from './common.service'
import {Ng2IzitoastService} from "ng2-izitoast";

@Injectable()

export class AuthInterceptor implements HttpInterceptor {
    constructor(
        private authService: AuthService,
        private iziToast: Ng2IzitoastService ,
        private commonService: CommonService
        ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler) {
        if(false){
            const authToken = this.authService.getToken();
            req = req.clone({
                setHeaders: {
                    Authorization: "Bearer " + authToken
                }
            });
            return next.handle(req)
                .catch(err => {
                // onError
                console.log(err);
                if (err instanceof HttpErrorResponse) {
                    console.log(err.status);
                    console.log(err.statusText);
                    if (err.status === 401) {
                        this.iziToast.warning({
                          title: 'Token Expired',
                          message:'Please Login Again',
                          position:'topCenter'
                        });
                        this.commonService.loader(false);
                        this.authService.logout();
                    }
                }
                return Observable.throw(err);
            }) as any;;
        }
        return next.handle(req);
    }
}
