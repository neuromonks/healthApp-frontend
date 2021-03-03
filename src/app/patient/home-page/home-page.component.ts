import { Component, OnInit } from '@angular/core';
import {AuthService, CommonService} from "../../services";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Ng2IzitoastService} from "ng2-izitoast";
import {BsModalService} from "ngx-bootstrap/modal";
import { GoogleChartInterface } from 'ng2-google-charts';
@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
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
  constructor(private authService:AuthService,
              private iziToast: Ng2IzitoastService ,
              private builder: FormBuilder,
              private commonService:CommonService,
              private modalService: BsModalService) { }

  ngOnInit() {
    if(!this.authService.isLoggedIn){
      this.commonService.navigateTo('/login');
    }else{
      this.userData = this.authService.getUserInfo();
      if(this.userData.user_type !== 'patient'){
        this.commonService.navigateTo('/login');
      }
    }

    let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
      "July", "Aug", "Sept", "Oct", "Nov", "Dec"
    ];

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
  getJsonKeys(json){
    return Object.keys(json);
  }

}
