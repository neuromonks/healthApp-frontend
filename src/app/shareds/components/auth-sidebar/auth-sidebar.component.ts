import { Component, OnInit } from '@angular/core';
import { AppURL } from 'src/app/app.url';

// import { AccountService, IAccount } from '../../services/account.service';
import { Router } from '@angular/router';
import { Ng2IzitoastService } from 'ng2-izitoast';
import {AuthService, LanguageTranslationService} from '../../../services';


@Component({
  selector: 'app-auth-sidebar',
  templateUrl: './auth-sidebar.component.html',
  styleUrls: ['./auth-sidebar.component.css']
})
export class AuthSidebarComponent implements OnInit {
  isAdmin = false;
  userData:any;
  constructor(
    private router:Router,
    private iziToast: Ng2IzitoastService ,
    private authService: AuthService,
    private _languageTranslation : LanguageTranslationService
  ) {
    this.initialloadUserLogin();
  }

  languageTranslation(key){
    return this._languageTranslation.translate(key);
  }

  AppURL = AppURL;

  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.userData = this.authService.getUserInfo();
  }

  private initialloadUserLogin(){

  }

}
