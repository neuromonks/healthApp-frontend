import { Component, OnInit } from '@angular/core';
import {AuthService, CommonService} from "../../services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Ng2IzitoastService} from "ng2-izitoast";

@Component({
  selector: 'app-must-form',
  templateUrl: './must-form.component.html',
  styleUrls: ['./must-form.component.css']
})
export class MustFormComponent implements OnInit {
  userData:any;
  mustForm: FormGroup;
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
    this.mustForm = this.builder.group({
      height: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      age: ['', [Validators.required,]],
      weightChangeFlag: ['', [Validators.required,]],
      intake : ['', [Validators.required,]],
    });
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.mustForm.controls)
    if (this.mustForm.invalid) {
      this.iziToast.warning({
        title: 'Error!',
        message: 'Please fill all required fields',
        position: 'topCenter'
      });
      return;
    }



  }

}
