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
  weightLossPercentage = 0;
  bmi = 0;
  bmiScore = 0;
  totalNutritionScore = -1;
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
      age: ['', []],
      weightChangeFlag: ['', []],
      intake : ['', [Validators.required,]],
      monthweight3: ['', [Validators.required,]]
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.mustForm.invalid) {
      this.iziToast.warning({
        title: 'Error!',
        message: 'Please fill all required fields',
        position: 'topCenter'
      });
      return;
    }
    this.weightLossPercentage = ((this.mustForm.value.weight - this.mustForm.value.monthweight3)/this.mustForm.value.weight)*100;
    if(this.weightLossPercentage<=10 && this.weightLossPercentage>=5 ){
      this.mustForm.patchValue({
        weightChangeFlag:1
      },)
    }else if(this.weightLossPercentage>10){
      this.mustForm.patchValue({
        weightChangeFlag:2
      },)
    }else{
      this.mustForm.patchValue({
        weightChangeFlag:0
      },)
    }
    let heightInMeter = this.mustForm.value.height/100;
    this.bmi = this.mustForm.value.weight/(heightInMeter*heightInMeter);
    if(this.bmi>=18.5 && this.bmi<=20){
      this.bmiScore=1;
    }else if(this.bmi>20){
      this.bmiScore=2;
    }else{
      this.bmiScore=0;
    }
    this.totalNutritionScore = this.bmiScore+this.mustForm.value.weightChangeFlag + (+this.mustForm.value.intake)


  }

}
