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
  dtOptions: any = {};
  months = '';
  weigthData ;
  noDataError = false;
  previousMustData = [];
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
    this.dtOptions = {
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
    this.getMustFormData();

    let today = new Date();
    let year = today.getFullYear();
    let month = today.getMonth();

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

    this.mustForm = this.builder.group({
      height: ['', [Validators.required]],
      weight: ['', [Validators.required]],
      age: ['', []],
      weightChangeFlag: ['', []],
      intake : ['', [Validators.required,]],
      monthweight3: ['', [Validators.required,]]
    });
    if(this.weigthData.hasOwnProperty(this.months)){
        this.mustForm.patchValue({monthweight3:this.weigthData[this.months]['data']['weight'],
        height:this.userData['height']});
    }


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
    this.weightLossPercentage = ((this.mustForm.value.weight - this.mustForm.value.monthweight3) / this.mustForm.value.weight) * 100;
    if (this.weightLossPercentage <= 10 && this.weightLossPercentage >= 5) {
      this.mustForm.patchValue({
        weightChangeFlag: 1
      },)
    } else if (this.weightLossPercentage > 10) {
      this.mustForm.patchValue({
        weightChangeFlag: 2
      },)
    } else {
      this.mustForm.patchValue({
        weightChangeFlag: 0
      },)
    }
    let heightInMeter = this.mustForm.value.height / 100;
    this.bmi = this.mustForm.value.weight / (heightInMeter * heightInMeter);

    if (this.bmi >= 18.5 && this.bmi <= 20) {
      this.bmiScore = 1;
    } else if (this.bmi > 20) {
      this.bmiScore = 2;
    } else {
      this.bmiScore = 0;
    }
    localStorage.setItem('BMIData', JSON.stringify({'bmi': this.bmi, 'bimScore': this.bmiScore}))
    this.totalNutritionScore = this.bmiScore + this.mustForm.value.weightChangeFlag + (+this.mustForm.value.intake)

    let dataToSend = {
      "patient_id": this.userData['id'],
      "nutrient_intake": this.mustForm.value.intake ? true : false,
      "bmi": this.bmi,
      "bmi_score": this.bmiScore,
      "weight_change_percentage": this.weightLossPercentage,
      "weight_change_score": this.mustForm.value.weightChangeFlag,
      "finalScore":this.totalNutritionScore,
    }

    this.commonService.apiCall('post', 'form/must', dataToSend).subscribe(
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

  getMustFormData(){
    this.commonService.loader(true);
    this.commonService.apiCall('get','form/must?patient_id='+this.userData['id']).subscribe(
      data=>{
        if(data['success']){
          this.previousMustData = data['result']
          for(let eachEntry of this.previousMustData){
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

  getJsonKeys(json){
    return Object.keys(json);
  }


}
