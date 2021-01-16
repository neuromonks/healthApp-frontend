import { Component, OnInit } from '@angular/core';
import { AppURL } from 'src/app/app.url';
import { Router } from '@angular/router';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { AuthService,CommonService, LanguageTranslationService } from '../../../services';

@Component({
  selector: 'app-auth-navbar',
  templateUrl: './auth-navbar.component.html',
  styleUrls: ['./auth-navbar.component.css']
})
export class AuthNavbarComponent implements OnInit {
  currenUser = {}
  constructor(
    private router: Router,
    private iziToast: Ng2IzitoastService,
    private authService : AuthService,
    private commonService : CommonService,
    private _languageTranslation : LanguageTranslationService
  ) {

  }
  isAdmin=false;
  currentLangugeMarathi=false;
  AppURL = AppURL;

  languageTranslation(key){
    return this._languageTranslation.translate(key);
  }

  ngOnInit() {
    this.currenUser = this.authService.getUserInfo();
    this.isAdmin = this.authService.isAdmin();
  }

  onLogout() {
    this.authService.logout();
    this.router.navigate(['/', AppURL.Login]);
    console.log('Logout');
  }

  changeLanguage(){
    this.currentLangugeMarathi=!this.currentLangugeMarathi
    this.commonService.boradcast('language',this.currentLangugeMarathi);
  }


}
