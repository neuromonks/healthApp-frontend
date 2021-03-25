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
  imparedForm: FormGroup;
  diseaseForm: FormGroup;
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
  resultClass='text-info';
  finalResult = '';
  ageOfPerson = -1;
  imparedFormDisplay =false;
  bmiData = null;
  diseaseList=[]
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
    if(localStorage.getItem('BMIData'))
    {
      this.bmiData = JSON.parse(localStorage.getItem('BMIData'))
      this.bmiValue = this.bmiData['bmi']
    }
    else{
      this.noDataError = true;
      this.commonService.navigateTo('/patient');
    }
    if(localStorage.getItem('weightData'))
    {
      this.weigthData = JSON.parse(localStorage.getItem('weightData'))
    }else{
      this.noDataError = true;
      this.commonService.navigateTo('/patient');
    }

    // if(localStorage.getItem('bmi'))
    // {
    //   this.bmiValue = +(JSON.parse(localStorage.getItem('bmi')))
    // }else{
    //   this.noDataError = true;
    //   this.commonService.navigateTo('/patient');
    // }

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

    this.imparedForm = this.builder.group({
      nutritionStatus: ['', [Validators.required]]

    });
    this.diseaseForm = this.builder.group({
      nutritionStatus: ['', [Validators.required]],
      disease : ['', [Validators.required]],
      diseaseName : ['', [Validators.required]],
    });
    console.log("3456",this.bmiValue)
    if(this.bmiValue<20.5){
      console.log('d')
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
    this.getNRSFormData();
    let dob=new Date(this.userData['dob'])
    let month_diff = Date.now() - dob.getTime();

    //convert the calculated difference in date format
    let age_dt = new Date(month_diff);

    //extract year from date
    let year1 = age_dt.getUTCFullYear();

    //now calculate the age of the user
    let age = Math.abs(year1 - 1970);
    console.log(age);
    this.ageOfPerson = age;
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
    let dataToSend = {};
    if(this.nrsForm.value.bmiIndicator == "1" || this.nrsForm.value.weightChange == "1" || this.nrsForm.value.dieteryIntakeLost == "1" || this.nrsForm.value.illFlag == "1"){
      if(this.nrsForm.value.illFlag == "1"){
        this.imparedFormDisplay = false;
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
        this.imparedFormDisplay = true;
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
      dataToSend['bmiIndicator']=(+this.nrsForm.value.bmiIndicator)
      dataToSend['weightChange']=(+this.nrsForm.value.weightChange)
      dataToSend['dieteryIntakeLost']=(+this.nrsForm.value.dieteryIntakeLost)
      dataToSend['illFlag']=(+this.nrsForm.value.illFlag)
      dataToSend['finalResult']=this.finalResult
      dataToSend['patient_id']=this.userData['id']
      dataToSend['finalScore']= 0
      this.commonService.apiCall('post','form/nrs',dataToSend).subscribe(data=>{
        this.getNRSFormData()
        this.iziToast.info({
          title: 'Info',
          message: data['message'],
          position: 'topCenter'
        });
      },error=>{
        console.log(error);
        this.iziToast.info({
          title: 'Info',
          message: error['message'],
          position: 'topCenter'
        });
      });
    }
    this.firstForm = false;



  }

  getJsonKeys(json){
    return Object.keys(json);
  }

  secondFormCalculation(){
    let fg;
    if(this.imparedFormDisplay){
      if(this.imparedForm.invalid) {
        this.iziToast.warning({
          title: 'Error!',
          message: 'Please fill all required fields',
          position: 'topCenter'
        });
        return;
      }
      fg = this.imparedForm.value

    }else{
      if(this.diseaseForm.invalid) {
        this.iziToast.warning({
          title: 'Error!',
          message: 'Please fill all required fields',
          position: 'topCenter'
        });
        return;
      }
      fg = this.diseaseForm.value
    }
    let dataToSend = {}
    if(fg.hasOwnProperty('disease') && fg.hasOwnProperty('nutritionStatus')){
      this.table2Score = (+fg['disease'])+(+fg['nutritionStatus'])
      dataToSend['disease']=(+fg['disease'])
      dataToSend['nutritionStatus']=(+fg['nutritionStatus'])
      dataToSend['disease_name']=fg['diseaseName']
    }else if(fg.hasOwnProperty('nutritionStatus')){
      this.table2Score = (+fg['nutritionStatus'])
      dataToSend['nutritionStatus']=(+fg['nutritionStatus'])
    }

    if(this.ageOfPerson>70){
      this.table2Score+1;
    }
    if(this.table2Score>=3){
      this.finalResult = 'The patient is nutritionally at-risk and a nutritional care plan is initiated ';
      this.showTable2result=true;
      this.resultClass = 'text-danger'
    }else{
      this.finalResult = 'Weekly rescreening of the patient';
      this.showTable2result=true;
    }
    this.showTableTwo = false
    dataToSend['bmiIndicator']=(+this.nrsForm.value.bmiIndicator)
    dataToSend['weightChange']=(+this.nrsForm.value.weightChange)
    dataToSend['dieteryIntakeLost']=(+this.nrsForm.value.dieteryIntakeLost)
    dataToSend['illFlag']=(+this.nrsForm.value.illFlag)
    dataToSend['finalResult']=this.finalResult
    dataToSend['patient_id']=this.userData['id']
    dataToSend['finalScore']= this.table2Score;
    this.commonService.apiCall('post','form/nrs',dataToSend).subscribe(data=>{
      this.iziToast.info({
        title: 'Info',
        message: data['message'],
        position: 'topCenter'
      });
      this.getNRSFormData()
    },error=>{
      console.log(error);
      this.iziToast.info({
        title: 'Info',
        message: error['message'],
        position: 'topCenter'
      });
    });
  }

  getNRSFormData(){
    this.commonService.loader(true);
    this.commonService.apiCall('get','form/nrs?patient_id='+this.userData['id']).subscribe(
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

  getValueOfFormOption(key,value){
    let formData = {
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
      },};
    let ans = '';
    for(let eachOption of formData[key]['options']){
      if(eachOption['value']==value){
        ans = eachOption['label'];
        break;
      }
    }

    return ans;
  }

  diseaseChange(data){
    let options = [
      {label: 'None',value:0},
      { label: 'Hip fracture*, Chronic patients, cirrhosis*, COPD*, Chronic hemodialysis, diabetes, oncology', value: 1 },
      { label: 'Major abdominal surgery*, Stroke*, Severe pneumonia, hematologic malignancy', value: 2 },
      {label: 'Head injury*, Bone marrow transplantation*, Intensive care patients (APACHE410).',value:3},

    ]

    data=parseInt(data)
    this.diseaseList = options[data]['label'].split(',')
    console.log(this.diseaseList)
  }

}
