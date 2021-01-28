import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService, CommonService} from "../../services";
import {Ng2IzitoastService} from "ng2-izitoast";

@Component({
  selector: 'app-mna-form',
  templateUrl: './mna-form.component.html',
  styleUrls: ['./mna-form.component.css']
})
export class MnaFormComponent implements OnInit {
  userData:any;
  mnaForm: FormGroup;
  submitted = false;
  mnaBasicScore = -1;
  assesMentScore = -1;
  totalScore = -1;
  startAssesment = false;
  dtOptions: any = {};
  previousMustData = [];
  screeningData;
  json: any = {
    questionA: {
      label: 'A. Has food intake declined over the past 3 months due to loss\n' +
        'of appetite, digestive problems, chewing or swallowing\n' +
        'difficulties?',
      type: 'select',
      options: [
        { label: 'severe decrease in food intake', value: 0 },
        { label: ' moderate decrease in food intake', value: 1 },
        {label: ' no decrease in food intake',value:2}
      ],
      validation: {
      "required": true}
    },
    questionB: {
      label: 'B. Weight loss during the last 3 months?',
      type: 'select',
      options: [
        { label: 'weight loss greater than 3kg (6.6lbs)', value: 0 },
        { label: 'does not know', value: 1 },
        {label: 'weight loss between 1 and 3kg (2.2 and 6.6 lbs)',value:2},
        {label: 'no weight loss',value:3}
      ],
      validation: {
        "required": true}
    },
    questionC: {
      label: 'C. Mobility',
      type: 'select',
      options: [
        { label: 'bed or chair bound', value: 0 },
        { label: 'able to get out of bed / chair but does not go out', value: 1 },
        {label: 'goes out',value:2},
      ],
      validation: {
        "required": true}
    },
    questionD: {
      label: 'D. Has suffered psychological stress or acute disease in the past 3 months?',
      type: 'select',
      options: [
        { label: 'yes', value: 0 },
        { label: 'no', value: 1 },
      ],
      validation: {
        "required": true}
    },
    questionE: {
      label: 'E. Neuropsychological problems',
      type: 'select',
      options: [
        { label: 'severe dementia or depression', value: 0 },
        { label: 'mild dementia', value: 1 },
        {label: 'no psychological problems',value: 2}
      ],
      validation: {
        "required": true}
    },
    questionF: {
      label: 'F. Body Mass Index (BMI) = weight in kg / (height in m) 2',
      type: 'select',
      options: [
        { label: 'BMI less than 19', value: 0 },
        { label: 'BMI 19 to less than 21', value: 1 },
        {label: 'BMI 21 to less than 23',value: 2},
        {label: 'BMI 23 or greater',value:3}
      ],
      validation: {
        "required": true}
    }
  };
  json2: any = {
    questionG: {
      label: 'G. Lives independently (not in nursing home or hospital)',
      type: 'select',
      options: [
        { label: 'yes', value: 0 },
        { label: 'no', value: 1 },
      ],
      validation: {
        "required": true}
    },
    questionH: {
      label: 'H. Takes more than 3 prescription drugs per day',
      type: 'select',
      options: [
        { label: 'yes', value: 0 },
        { label: 'no', value: 1 },
      ],
      validation: {
        "required": true}
    },
    questionI: {
      label: 'I. Pressure sores or skin ulcers',
      type: 'select',
      options: [
        { label: 'yes', value: 0 },
        { label: 'no', value: 1 },
      ],
      validation: {
        "required": true}
    },
    questionJ: {
      label: 'J. How many full meals does the patient eat daily?',
      type: 'select',
      options: [
        { label: '1 meal', value: 0 },
        { label: '2 meals', value: 1 },
        { label: '3 meals', value: 2 },
      ],
      validation: {
        "required": true}
    },
    questionK: {
      label: 'K. Selected consumption markers for protein intake',
      type: 'na',
    },
    questionK1: {
      label: 'K-1. Selected consumption markers for protein intake',
      type: 'select',
      options: [
        { label: 'no', value: 0 },
        { label: 'yes', value: 1 },

      ],
      validation: {
        "required": true}
    },
    questionK2: {
      label: 'K-2. Two or more servings of legumes or eggs per week',
      type: 'select',
      options: [
        { label: 'no', value: 0 },
        { label: 'yes', value: 1 },

      ],
      validation: {
        "required": true}
    },
    questionK3: {
      label: 'K-3. Meat, fish or poultry every day',
      type: 'select',
      options: [
        { label: 'no', value: 0 },
        { label: 'yes', value: 1 },

      ],
      validation: {
        "required": true}
    },
    questionL: {
      label: 'L. Consumes two or more servings of fruit or vegetables per day?',
      type: 'select',
      options: [
        { label: 'no', value: 0 },
        { label: 'yes', value: 1 },

      ],
      validation: {
        "required": true}
    },
    questionM: {
      label: 'M. How much fluid (water, juice, coffee, tea, milk...) is consumed per day?',
      type: 'select',
      options: [
        { label: 'less than 3 cups', value: 0 },
        { label: '3 to 5 cups', value: 0.5 },
        { label: 'more than 5 cups', value: 1 },
      ],
      validation: {
        "required": true}
    },
    questionN: {
      label: 'N. Mode of feeding',
      type: 'select',
      options: [
        { label: 'unable to eat without assistance', value: 0 },
        { label: 'self-fed with some difficulty', value: 1 },
        { label: ' self-fed without any problem', value: 2 },
      ],
      validation: {
        "required": true}
    },
    questionO: {
      label: 'O. Self view of nutritional status',
      type: 'select',
      options: [
        { label: 'views self as being malnourished', value: 0 },
        { label: 'is uncertain of nutritional state', value: 1 },
        { label: 'views self as having no nutritional problem', value: 2 },
      ],
      validation: {
        "required": true}
    },
    questionP: {
      label: 'P. In comparison with other people of the same age, how does the patient consider his / her health status?',
      type: 'select',
      options: [
        { label: 'not as good', value: 0},
        { label: 'does not know', value: 0.5 },
        { label: 'as good', value: 1 },
        { label: 'better', value: 1 },
      ],
      validation: {
        "required": true}
    }
  };

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
    this.getMNAFormData();
    this.mnaForm = this.builder.group({
      questionA: ['', [Validators.required]],
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      dom: 'Bfrtip',
      buttons: [

      ]
    };

  }



  onSubmit() {
    this.submitted = true;
    console.log(this.mnaForm.controls)
    if (this.mnaForm.invalid) {
      this.iziToast.warning({
        title: 'Error!',
        message: 'Please fill all required fields',
        position: 'topCenter'
      });
      return;
    }
  }

  screeningScoreCalculation(fg) {
    this.screeningData = fg;
    this.mnaBasicScore = 0;
    console.log(fg)
    for(let eachAns of Object.keys(fg)){
      this.mnaBasicScore+=(+fg[eachAns])
    }
    if(this.mnaBasicScore<=11){
      this.startAssesment = true;
    }else{
      let dataToSend = fg;
      dataToSend['patient_id']=this.userData['id']
      this.commonService.apiCall('post', 'form/mna', dataToSend).subscribe(
        data => {
          console.log(data)
          this.iziToast.info({
            title: 'Info',
            message: data['message'],
            position: 'topCenter'
          });
        },
        error => {
          console.log(error)
        }
      );
    }
  }

  assesMentCalculation(fg){
    let dataToSend = this.screeningData;
    this.assesMentScore = 0;
    let kQuestionScore =(+fg['questionK1'])+(+fg['questionK2'])+(+fg['questionK3'])

    if(kQuestionScore==3){
      fg['questionK']=1
    }else if(kQuestionScore==2){
      fg['questionK']=0.5
    }else{
      fg['questionK']=0
    }
    for(let eachKey of Object.keys(fg)){
      dataToSend[eachKey]=fg[eachKey]
    }
    delete fg['questionK1'];
    delete fg['questionK2'];
    delete fg['questionK3'];
    for(let eachAns of Object.keys(fg)){
      this.assesMentScore+=(+fg[eachAns])
    }
    dataToSend['assessmentScore']=this.assesMentScore;
    dataToSend['screeningScore']=this.mnaBasicScore;
    dataToSend['patient_id']=this.userData['id'];

    this.totalScore=this.assesMentScore+this.mnaBasicScore;
    this.commonService.apiCall('post', 'form/mna', dataToSend).subscribe(
      data => {
        console.log(data)
        this.iziToast.info({
          title: 'Info',
          message: data['message'],
          position: 'topCenter'
        });
      },
      error => {
        console.log(error)
      }
    );
  }

  getMNAFormData(){
    this.commonService.loader(true);
    this.commonService.apiCall('get','form/mna?patient_id='+this.userData['id']).subscribe(
      data=>{
        if(data['success']){
          this.previousMustData = data['result']
          for(let eachEntry of this.previousMustData){
            eachEntry['finalScore']=eachEntry['assessmentScore']+eachEntry['screeningScore'];
          }
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
