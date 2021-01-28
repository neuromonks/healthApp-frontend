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
  months = '';
  weigthData ;
  noDataError = false;
  previousMustData = [];
  dtOptions: any = {};
  bmiValue ;
  showTableTwo = false;
  firstForm =true;
  table2Score = -1;
  json: any = {
  };
  showTable1result = false;
  showTable2result = false;
  finalResult = '';
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
    }this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      dom: 'Bfrtip',
      buttons: [

      ]
    };

    if(localStorage.getItem('weightData'))
    {
      this.weigthData = JSON.parse(localStorage.getItem('weightData'))
    }else{
      this.noDataError = true;
      this.commonService.navigateTo('/patient');
    }

    if(localStorage.getItem('bmi'))
    {
      this.bmiValue = +(JSON.parse(localStorage.getItem('bmi')))
    }else{
      this.noDataError = true;
      this.commonService.navigateTo('/patient');
    }

    for(let item of Object.keys(this.weigthData)){
      if(!this.weigthData[item]['dataFlag']){
        this.iziToast.warning({
          title: 'Error!',
          message: 'Please fill all required fields on dashboard',
          position: 'topCenter'
        });
      }
    }

    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];


    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();
    let currentWeight = this.weigthData[monthNames[month]+'-'+year]['data']['weight']
    let i = 0;
    do {
      let key=monthNames[month]+'-'+year;
      this.months = monthNames[month]+'-'+year
      if(month == 0) {
        month = 11;
        year--;
      } else {
        month--;
      }
      i++;
    } while(i < 4);
    this.nrsForm = this.builder.group({
      age: ['', [Validators.required]],
      bmiIndicator: ['', [Validators.required]],
      weightChange: ['', [Validators.required,]],
      dieteryIntakeLost : ['', [Validators.required,]],
      illFlag:['', [Validators.required,]],

    });

    if(this.bmiValue<20.5){
      this.nrsForm.patchValue({
        bmiIndicator:"1"
      })
    }else{
      this.nrsForm.patchValue({
        bmiIndicator:"0"
      })
    }
    for(let item of Object.keys(this.weigthData)){
      if(this.weigthData[item]['data']['weight']>currentWeight){
        this.nrsForm.patchValue({
          weightChange:"1"
        });
        break;
      }else {
        this.nrsForm.patchValue({
          weightChange:"0"
        });
      }
    }

    let dob=new Date(this.userData['dob'])
    let month_diff = Date.now() - dob.getTime();

    //convert the calculated difference in date format
    let age_dt = new Date(month_diff);

    //extract year from date
    let year1 = age_dt.getUTCFullYear();

    //now calculate the age of the user
    let age = Math.abs(year1 - 1970);
    console.log(age);
    this.nrsForm.patchValue({
      age:age
    })
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
    this.firstForm = false;
    if(this.nrsForm.value.bmiIndicator == "1" || this.nrsForm.value.weightChange == "1" || this.nrsForm.value.dieteryIntakeLost == "1" || this.nrsForm.value.illFlag == "1"){
      if(this.nrsForm.value.illFlag == "1"){
        this.json={
          nutritionStatus: {
            label: 'Impaired nutritional status',
            type: 'select',
            options: [
              { label: 'Normal nutritional status', value: 0 },
              { label: 'Wt loss 45% in 3 mths or Food intake below 50–75% of normal requirement in preceding week', value: 1 },
              {label: 'Wt loss 45% in 2 mths or BMI 18.5 – 20.5 + impaired general condition or Food intake 25–60% of normal requirement in preceding week',value:2},
              {label: 'Wt loss 45% in 1 mth (415% in 3 mths) or BMI o18.5 + impaired general condition or Food intake 0-25% of normal requirement in preceding week in preceding week',value:3}
            ],
            validation: {
              "required": true}
          },
          disease: {
            label: 'Severity of disease (E increase in requirements)',
            type: 'select',
            options: [
              { label: 'Hip fracture* Chronic patients, in particular with acute complications: cirrhosis*, COPD*. Chronic hemodialysis, diabetes, oncology', value: 1 },
              { label: 'Major abdominal surgery* Stroke* Severe pneumonia, hematologic malignancy', value: 2 },
              {label: 'Head injury* Bone marrow transplantation* Intensive care patients (APACHE410).',value:3},
              {label: 'Normal nutritional requirements',value:0}
            ],
            validation: {
              "required": true}
          },}
      }else{
        this.json={
          nutritionStatus: {
            label: 'Impaired nutritional status',
            type: 'select',
            options: [
              { label: 'Normal nutritional status', value: 0 },
              { label: 'Wt loss 45% in 3 mths or Food intake below 50–75% of normal requirement in preceding week', value: 1 },
              {label: 'Wt loss 45% in 2 mths or BMI 18.5 – 20.5 + impaired general condition or Food intake 25–60% of normal requirement in preceding week',value:2},
              {label: 'Wt loss 45% in 1 mth (415% in 3 mths) or BMI o18.5 + impaired general condition or Food intake 0-25% of normal requirement in preceding week in preceding week',value:3}
            ],
            validation: {
              "required": true}
          },
          }
      }
      this.showTableTwo = true;
    }else{
      this.finalResult = 'The patient is re-screened at weekly intervals';
      this.showTable1result = true;
    }
    this.firstForm = false;

  }

  getJsonKeys(json){
    return Object.keys(json);
  }

  secondFormCalculation(fg){

    if(fg.hasOwnProperty('disease') && fg.hasOwnProperty('nutritionStatus')){
      this.table2Score = fg['disease']+fg['nutritionStatus']
    }else if(fg.hasOwnProperty('nutritionStatus')){
      this.table2Score = fg['nutritionStatus']
    }

    if(this.table2Score>=3){
      this.finalResult = 'The patient is nutritionally at-risk and a nutritional care plan is initiated ';
      this.showTable2result=true;
    }else{
      this.finalResult = 'Weekly rescreening of the patient';
      this.showTable2result=true;
    }
  }

  getNRSFormData(){
    this.commonService.loader(true);
    this.commonService.apiCall('get','form/mna?patient_id='+this.userData['id']).subscribe(
      data=>{
        if(data['success']){
          this.previousMustData = data['result']
          this.commonService.loader(false);
        }else{
          this.commonService.loader(false);
          this.iziToast.warning({
            title: 'Warning',
            message: data['message'],
            position: 'topCenter'
          });
        }
      },
      error=>{
        this.commonService.loader(false);
        this.iziToast.warning({
          title: 'Warning',
          message: error['message'],
          position: 'topCenter'
        });
      }
    );
  }

}
