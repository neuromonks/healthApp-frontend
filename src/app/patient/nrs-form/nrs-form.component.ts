import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService, CommonService} from "../../services";
import {Ng2IzitoastService} from "ng2-izitoast";

@Component({
  selector: 'app-nrs-form',
  templateUrl: './nrs-form.component.html',
  styleUrls: ['./nrs-form.component.css']
})
export class NrsFormComponent implements OnInit {
  userData:any;
  nrsForm: FormGroup;
  submitted = false;

  constructor(private authService:AuthService,
              private commonService:CommonService,
              private builder: FormBuilder,
              private iziToast: Ng2IzitoastService) { }

  ngOnInit() {
    if(!this.authService.isLoggedIn){
      this.commonService.navigateTo('/login');
    }else{
      this.userData = this.authService.getUserInfo();
      if(this.userData.user_type !== 'patient'){
        this.commonService.navigateTo('/login');
      }
    }
    this.nrsForm = this.builder.group({
      age: ['', [Validators.required]],
      bmiIndicator: ['', [Validators.required]],
      weightChange: ['', [Validators.required,]],
      dieteryIntakeLost : ['', [Validators.required,]],
      illFlag:['', [Validators.required,]]
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.nrsForm.controls)
    if (this.nrsForm.invalid) {
      this.iziToast.warning({
        title: 'Error!',
        message: 'Please fill all required fields',
        position: 'topCenter'
      });
      return;
    }



  }

}
