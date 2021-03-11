import { Component, OnInit } from '@angular/core';
import {Ng2IzitoastService} from "ng2-izitoast";
import {AuthService, CommonService} from "../../services";
import {ActivatedRoute} from "@angular/router";
import {GoogleChartInterface} from "ng2-google-charts";

@Component({
  selector: 'app-patient-details',
  templateUrl: './patient-details.component.html',
  styleUrls: ['./patient-details.component.css']
})
export class PatientDetailsComponent implements OnInit {
  dtOptions: any = {};
  userId ;
  mustData=[];
  mnaData=[];
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
  json1: any = {
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
      value:2,
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

    questionK1: {
      label: 'K. Selected consumption markers for protein intake \n K-1. Selected consumption markers for protein intake',
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
  previousNRSData=[];
  previousMNSTData=[];
  userData:any;
  currentMonth;
  lastMonth;
  lastMonth2;
  lastMonth3;
  months = {};
  showForm =false;
  public pieChart: GoogleChartInterface = {
    chartType: 'ColumnChart',
    dataTable: [
      ['Year', 'Sales', 'Expenses', 'Profit'],
      ['2014', 1000, 400, 200],
      ['2015', 1170, 460, 250],
      ['2016', 660, 1120, 300],
      ['2017', 1030, 540, 350]
    ],
    //firstRowIsData: true,
    options: {'title': 'Tasks'},
  };
  LastWeightData = [  ]
  formJson={}
  calories = 0;
  protein = 0;
  bmiValue=null;
  constructor(private iziToast: Ng2IzitoastService ,
              private commonService:CommonService,
              private activatedRoute: ActivatedRoute,
              private authService:AuthService) {

  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.userId = paramsId.patient_id;
      console.log(this.userId);
      this.getMustFormData();
    });

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      dom: 'Bfrtip',
      buttons: [
      ]
    };
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    this.userData = JSON.parse(localStorage.getItem('patientData'));
    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();

    let i = 0;
    do {
      let key=monthNames[month]+'-'+year;
      this.months[monthNames[month]+'-'+year]={
        'dataFlag':false,data:{},
      };
      if(month == 0) {
        month = 11;
        year--;
      } else {
        month--;
      }
      i++;
    } while(i < 4);

    localStorage.setItem('weightData',JSON.stringify(this.months));
    this.getLastThreeMonthData();
  }
  getLastThreeMonthData(){
    this.commonService.loader(true);
    this.commonService.apiCall('get','patient_weight?patient_id='+this.userData['id']).subscribe(
      data=>{
        if(data['success']){
          for(let eachMonthData of data['result']){
            if(this.months.hasOwnProperty(eachMonthData['month'])  ){
              this.months[eachMonthData['month']]['data']['weight']=eachMonthData['weight']
              this.months[eachMonthData['month']]['dataFlag']=true
            }
          }

          let today = new Date();
          let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
            "July", "Aug", "Sept", "Oct", "Nov", "Dec"
          ];
          let year = today.getFullYear();
          let month = today.getMonth();
          if(this.months[monthNames[month]+'-'+year]['dataFlag']){
            let bmi = this.months[monthNames[month]+'-'+year]['data']['weight']/((this.userData['height']/100)*(this.userData['height']/100));
            this.bmiValue=bmi;
            localStorage.setItem('BMIData', JSON.stringify({'bmi': bmi}))
            if(bmi<18.5){
              this.calories=30*this.months[monthNames[month]+'-'+year]['data']['weight'];
              this.protein=1.2*this.months[monthNames[month]+'-'+year]['data']['weight'];
            }else if(bmi<24.9 && bmi>=18.5){
              this.calories=25*this.months[monthNames[month]+'-'+year]['data']['weight'];
              this.protein=1*this.months[monthNames[month]+'-'+year]['data']['weight'];
            }else{
              this.calories=20*this.months[monthNames[month]+'-'+year]['data']['weight'];
              this.protein=0.8*this.months[monthNames[month]+'-'+year]['data']['weight'];
            }

            this.months[monthNames[month]+'-'+year]['data']['weight']
            localStorage.setItem('bmi',JSON.stringify(bmi));
          }
          this.generateForm();
          this.calculateWeightPercentageChange();
          localStorage.setItem('weightData',JSON.stringify(this.months));
          this.commonService.loader(false);
        }else{
          this.generateForm();
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

  generateForm(){
    for(let eachMonth of Object.keys(this.months)){
      console.log(eachMonth)
      if(this.months[eachMonth]['dataFlag']==false){
        this.formJson[eachMonth]={

          label: 'Enter Weight for month '+eachMonth,
          type: 'number',
          validation: {
            "required": true}

        }
      }
    }
    if(this.getJSONKeyLength(this.formJson)>0){
      this.showForm=true;
    }
    console.log(this.formJson)

  }

  submitFormData(data){
    for(let eachMonthData of Object.keys(data)){
      if(this.months.hasOwnProperty(eachMonthData) ){
        this.months[eachMonthData]['data']['weight']=data[eachMonthData];
        this.months[eachMonthData]['dataFlag']=true
      }
    }
    localStorage.setItem('weightData',JSON.stringify(this.months));
    for(let eachMonthData of Object.keys(data)){
      let dataToSend={
        "patient_id": this.userData['id'],
        "height" : this.userData['height'],
        "weight" : data[eachMonthData],
        "month" : eachMonthData
      }
      this.commonService.apiCall('post','patient_weight',dataToSend).subscribe(
        data=>{console.log(data)
          this.iziToast.info({
            title: 'Info',
            message: data['message'],
            position: 'topCenter'
          });
          this.showForm=false},

        error => {
          console.log(error)
        }
      );
    }
    this.getLastThreeMonthData();
  }

  getJSONKeyLength(json){
    return Object.keys(json).length
  }

  calculateWeightPercentageChange(){
    let today = new Date();
    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];
    let year = today.getFullYear();
    let month = today.getMonth();
    let currentWeight=0;
    if(this.months[monthNames[month]+'-'+year]['dataFlag']){
      currentWeight = this.months[monthNames[month]+'-'+year]['data']['weight'];
      if(currentWeight!=0){
        for(let item of Object.keys(this.months)){
          let lastWeight = this.months[item]['data']['weight'];
          this.months[item]['data']['weightChangeP'] = ((currentWeight - lastWeight) / currentWeight) * 100;
        }
      }
    }else{
      this.iziToast.info({
        title: 'Info',
        message: 'Please update current weight',
        position: 'topCenter'
      });
    }
  }


  getMustFormData(){
    this.commonService.loader(true);
    this.commonService.apiCall('get','form/must?patient_id='+this.userId).subscribe(
      data=>{
        if(data['success']){
          this.mustData = data['result']
          for(let eachEntry of this.mustData){
            let nutrScore = eachEntry['nutrient_intake']?1:0;
            eachEntry['finalScore']=eachEntry['bmi_score']+eachEntry['weight_change_score']+nutrScore;
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

  getMNAFormData(){
    this.commonService.loader(true);
    this.commonService.apiCall('get','form/mna?patient_id='+this.userId).subscribe(
      data=>{
        if(data['success']){
          this.mnaData = data['result']
          for(let eachEntry of this.mnaData){
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
  getNRSFormData(){
    console.log("hete");
    this.commonService.loader(true);
    this.commonService.apiCall('get','form/nrs?patient_id='+this.userId).subscribe(
      data=>{
        if(data['success']){
          this.previousNRSData = data['result']
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
  getMNSTFormData(){
    this.commonService.loader(true);
    this.commonService.apiCall('get','form/mnst?patient_id='+this.userId).subscribe(
      data=>{
        if(data['success']){
          this.previousMNSTData = data['result']
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
  getValueOfMNA1FormOption(key,value){
    let ans = 'NA';
    if(value==null){
      return ans
    }
    for(let eachOption of this.json1[key]['options']){
      if(eachOption['value']==value){
        ans = eachOption['label'];
        break;
      }
    }

    return ans;
  }
  getValueOfMNA2FormOption(key,value){
    let ans = '';
    for(let eachOption of this.json2[key]['options']){
      if(eachOption['value']==value){
        ans = eachOption['label'];
        break;
      }
    }

    return ans;
  }

  getValueOfNRSFormOption(key,value){
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

  getJsonKeys(json){
    return Object.keys(json);
  }

}
