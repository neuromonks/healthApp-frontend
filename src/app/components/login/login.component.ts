import { Component, OnInit } from '@angular/core';
import { AppURL } from '../../app.url';
import { ILoginComponent } from './login.interface';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Ng2IzitoastService } from 'ng2-izitoast';
import { Router } from '@angular/router';
import { AuthenService } from 'src/app/services/authen.service';
import { CommonService, AuthService } from 'src/app/services';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  Url = AppURL;
  form: FormGroup;
  submitted = false;

  constructor(
    private builder: FormBuilder,
    private iziToast: Ng2IzitoastService ,
    private router: Router,
    private commonService :  CommonService,
    private authService: AuthService
  ) {

  }

  ngOnInit(){
    this.form = this.builder.group({
      email: ['', [Validators.required,Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]],
      password: ['', Validators.required]
      // remember: [true]
    });
    if(!this.authService.isLoggedIn){
      this.commonService.navigateTo('/login');
    }else{
      if(!this.authService.isMobileVerified()){
        this.commonService.navigateTo('/verify-otp');
      };
      if(this.authService.isAdmin()){
        this.commonService.navigateTo('/login')
      }
      if(this.authService.isLoggedIn && !this.authService.isAdmin()){
        this.commonService.navigateTo('/customer/home')
      }
    }
  }

  onSubmit() {
    this.submitted = true;
    if (this.form.invalid) {
       this.iziToast.warning({
        title: 'Error!',
        message: 'Please fill all required fields',
        position: 'topCenter'
      });
      return;
    }
    this.commonService.loader(true);
    this.commonService.apiCall('post','login',this.form.value).subscribe(
      data=>{
        this.commonService.loader(false);
        console.log(data)
        if(data['success']){
          this.iziToast.success({
            title: 'Success',
            message: "Logged In",
            position: 'topCenter'
          });
          this.authService.loggedIn(data['result'][0]);
            if(data['result'][0]['user_type']=='patient'){
              this.commonService.navigateTo('/patient');
            }
            this.commonService.navigateTo('/admin');

        }else{
          this.iziToast.warning({
            title: 'Warning',
            message: data['message'],
            position: 'topCenter'
          });
        }
      },
      error=>{
        this.commonService.loader(false);
        console.log(error);
      }
    );
  }
}
