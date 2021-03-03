import { Component, OnInit } from '@angular/core';
import {AppURL} from "../../app.url";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Ng2IzitoastService} from "ng2-izitoast";
import {Router} from "@angular/router";
import {AuthService, CommonService} from "../../services";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {
  Url = AppURL;
  form: FormGroup;
  resetForm = FormGroup;
  submitted = false;
  otpData;any=null;
  email='';
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

    });


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
    this.email = this.form.value['email']
    this.commonService.apiCall('get','user/forgotPassord?email='+this.form.value['email']).subscribe(
      data=>{
        this.commonService.loader(false);
        console.log(data)

        if(data['success']){
          this.iziToast.success({
            title: 'Success',
            message: "Please Check Mail For OTP",
            position: 'topCenter'
          });
          this.otpData = data['result']
          this.form = this.builder.group({
            otp : ['', [Validators.required, Validators.minLength(4),Validators.maxLength(4)]],
            password: ['', [Validators.required, Validators.minLength(6)]],
          });
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

  changePassword() {
    this.submitted = true;
    if (this.form.invalid) {
      this.iziToast.warning({
        title: 'Error!',
        message: 'Please fill all required fields',
        position: 'topCenter'
      });
      return;
    }
    let dataToSend=this.form.value;
    dataToSend['email'] = this.email;
    this.commonService.loader(true);
    this.commonService.apiCall('post','user/changePassord',dataToSend).subscribe(
      data=>{
        this.commonService.loader(false);
        console.log(data)
        if(data['success']){
          this.iziToast.success({
            title: 'Success',
            message: "Password Changed",
            position: 'topCenter'
          });
        this.commonService.navigateTo('/');
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

