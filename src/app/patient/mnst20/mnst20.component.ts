import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService, CommonService} from "../../services";
import {Ng2IzitoastService} from "ng2-izitoast";

@Component({
  selector: 'app-mnst20',
  templateUrl: './mnst20.component.html',
  styleUrls: ['./mnst20.component.css']
})
export class Mnst20Component implements OnInit {
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
  firstForm =false;
  mnst20BasicScore = 0
  table2Score = -1;
  json: any = {
    bmi: {
      label: 'BMI Score Range',
      type: 'select',
      options: [
        { label: 'BMI is > 20', value: 0 },
        { label: 'BMI is Between 18.5 - 20', value: 1 },
        {label: 'BMI is < 18.5 ',value:2}
      ],
      validation: {
        "required": true}
    },
    nutritionHealth: {
      label: 'If there has been no nutrition intake for > 5 days ',
      type: 'select',
      options: [
        { label: 'Yes', value: 2 },
        { label: 'No', value: 0 }
      ],
      validation: {
        "required": true}
    },
    nutritionStatus: {
      label: 'Impaired nutritional status',
      type: 'select',
      options: [
        { label: 'Normal nutritional status', value: 0 },
        { label: 'Wt loss 45% in 3 months', value: 1 },
        {label: 'Wt loss 45% in 2 months ',value:2},
        {label: 'Wt loss 45% in 1 month ',value:3}
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
    },
    mobility: {
      label: 'Mobility',
      type: 'select',
      options: [
        { label: 'bed or chair bound', value: 0 },
        { label: 'able to get out of bed / chair but does not go out', value: 1 },
        {label: 'goes out',value:2},
      ],
      validation: {
        "required": true}
    },modeOfFeeding: {
      label: 'Mode of feeding',
      type: 'select',
      options: [
        { label: 'unable to eat without assistance', value: 0 },
        { label: 'self-fed with some difficulty', value: 1 },
        { label: ' self-fed without any problem', value: 2 },
      ],
      validation: {
        "required": true}
    },
    healthStatus: {
      label: 'In comparison with other people of the same age, how does the patient consider his / her health status?',
      type: 'select',
      options: [
        { label: 'not as good', value: 0},
        { label: 'does not know', value: 0.5 },
        { label: 'as good', value: 1 },
        { label: 'better', value: 1 },
      ],
      validation: {
        "required": true}
    }};
  showTable1result = false;
  showTable2result = false;
  finalResult = '';
  ageOfPerson = -1;
  previousData={'must':[],'nrs':[],'mna':[]};
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
    this.checkPreviousData();
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
    this.getMNST20FormData();
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

  checkPreviousData(){
    let today= new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    this.commonService.loader(true);
    this.commonService.apiCall('get','form/data?patient_id='+this.userData['id']+'&date='+date).subscribe(data=>{
      this.commonService.loader(false);
      if(data['success']){
        this.previousData = data['result'];
        if(this.previousData['must'].length<=0){
          this.iziToast.info({
            title: 'Info',
            message: "Must Form Data Not Available Please fill it first",
            position: 'topCenter'
          });
          this.commonService.navigateTo('/patient/mustForm');
          return;
        }
        if(this.previousData['mna'].length==0){
          this.iziToast.info({
            title: 'Info',
            message: "MNA Form Data Not Available Please fill it first",
            position: 'topCenter'
          });
          this.commonService.navigateTo('/patient/mnaForm');
          return;
        }
        if(this.previousData['nrs'].length==0){
          this.iziToast.info({
            title: 'Info',
            message: "NRS Form Data Not Available Please fill it first",
            position: 'topCenter'
          });
          this.commonService.navigateTo('/patient/nrsForm');
          return;
        }
        this.json['bmi']['value']=this.previousData['must'][0]['bmi_score']
        this.json['nutritionHealth']['value']=this.previousData['must'][0]['nutrient_intake']?2:0
        this.json['nutritionStatus']['value']=this.previousData['nrs'][0]['nutritionStatus']
        this.json['disease']['value']=this.previousData['nrs'][0]['disease']
        this.json['mobility']['value']=this.previousData['mna'][0]['questionC']
        this.json['modeOfFeeding']['value']=this.previousData['mna'][0]['questionN']
        this.json['healthStatus']['value']=this.previousData['mna'][0]['questionP']

        this.showTableTwo = true;
      }else{
        console.log(data);
        this.iziToast.info({
          title: 'Info',
          message: data['message'],
          position: 'topCenter'
        });
      }
    },
      error => {
      this.commonService.loader(false);
        console.log(error);
        this.iziToast.info({
          title: 'Info',
          message: error['message'],
          position: 'topCenter'
        });
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
          bmiRange: {
            label: 'BMI (kg/m2)',
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
    this.mnst20BasicScore = 0;

    for(let eachAns of Object.keys(fg)){
      this.mnst20BasicScore+=(+fg[eachAns])
    }



    if(this.mnst20BasicScore>=0 && this.mnst20BasicScore<=4){
      this.finalResult = 'Low Nutrition Risk';
    }else if(this.mnst20BasicScore>=4.1 && this.mnst20BasicScore<=9) {
      this.finalResult = 'Medium Nutrition  Risk';
    }else{
      this.finalResult = 'High Nutrition Risk';
    }
      this.showTable2result = true;
    let dataToSend = {};
    dataToSend = JSON.parse(JSON.stringify(fg));
    dataToSend['patient_id'] = this.userData['id'];
    dataToSend['finalScore'] = this.mnst20BasicScore;
    dataToSend['finalResult'] = this.finalResult;
    this.commonService.apiCall('post','form/mnst',dataToSend).subscribe(data=>{
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

  getMNST20FormData(){
    this.commonService.loader(true);
    this.commonService.apiCall('get','form/mnst?patient_id='+this.userData['id']).subscribe(
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
    let ans = '';
    for(let eachOption of this.json[key]['options']){
      if(eachOption['value']==value){
        ans = eachOption['label'];
        break;
      }
    }

    return ans;
  }

}
