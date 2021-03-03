import { Component, OnInit } from '@angular/core';
import {Ng2IzitoastService} from "ng2-izitoast";
import {CommonService} from "../../services";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-predictions',
  templateUrl: './predictions.component.html',
  styleUrls: ['./predictions.component.css']
})
export class PredictionsComponent implements OnInit {
  userId ;
  mnaResult = null;
  nrsResult = null;
  mnst20Result = null;
  mustResult = null;
  constructor(private iziToast: Ng2IzitoastService ,
              private commonService:CommonService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.userId = paramsId.id;
      console.log(this.userId);
    });
  }

  mnaPredict(){
    let objectToSend = {
      "Food_Intake_decline" : 1,
      "Weight_Loss_Score": 1,
      "Mobility" : 0,
      "PS_or_AD" : 0,
      "Neuropsylogical_problems" : 1,
      "BMI_score" : 0,
      "Lives_independently" : 1,
      "precription" : 0,
      "Pressure_sores" : 1,
      "Meal" : 1,
      "Protein_intake" : 0.5,
      "Fruit" : 1,
      "Fluid_intake" : 1,
      "Mode_of_feeding" : 0,
      "Nutritional_status" : 1,
      "Health_status" : 1,
      "BMI" : 17.36,
      "score1(A-F)" : 3,
      "Nutrition_Assessment_Result(Total_score)=V1+(H-Q)" : 10.5

    }
    this.commonService.loader(true);
    this.commonService.apiCall('post','form/prediction?form_name=mna',objectToSend).subscribe(
      data=>{
        this.commonService.loader(false);
        if(data['success']){
          this.mnaResult = data['result']
        }else{

          this.iziToast.warning({
            title: 'Warning',
            message: data['message'],
            position: 'topCenter'
          });
        }
      },
      error =>{
        this.commonService.loader(false);
        this.iziToast.warning({
          title: 'Warning',
          message: error['message'],
          position: 'topCenter'
        });
      }
    );
  }
  mustPredict(){
    let objectToSend = {
      "BMI": 2 ,
      "Age": 70,
      "Weight" : 49,
      "wt_p" : 49,
      "wt_s" : 0,
      "ADE" : 2,
      "Wt_loss" : 0,
      "BMI.1" : 17.36
    }
    this.commonService.loader(true);
    this.commonService.apiCall('post','form/prediction?form_name=must',objectToSend).subscribe(
      data=>{
        this.commonService.loader(false);
        if(data['success']){
          this.mustResult = data['result']
        }else{

          this.iziToast.warning({
            title: 'Warning',
            message: data['message'],
            position: 'topCenter'
          });
        }
      },
      error =>{
        this.commonService.loader(false);
        this.iziToast.warning({
          title: 'Warning',
          message: error['message'],
          position: 'topCenter'
        });
      }
    );
  }
  nrsPredict(){
    let objectToSend = {
      "BMI<20.5" : 1,
      "Wt_loss" : 0,
      "Reduce_intake" : 1,
      "Severely_ill" : 1,
      "Impared_nutritional_status" : 1,
      "Severity_disease" : 1,
      "Total_score" : 2,
      "Age" : 70,
      "BMI" : 17,
      "Weight_Loss_Score" : 1,
      "Food_Intake_decline" : 1
    }
    this.commonService.loader(true);
    this.commonService.apiCall('post','form/prediction?form_name=nrs',objectToSend).subscribe(
      data=>{
        this.commonService.loader(false);
        if(data['success']){
          this.nrsResult = data['result']
        }else{

          this.iziToast.warning({
            title: 'Warning',
            message: data['message'],
            position: 'topCenter'
          });
        }
      },
      error =>{
        this.commonService.loader(false);
        this.iziToast.warning({
          title: 'Warning',
          message: error['message'],
          position: 'topCenter'
        });
      }
    );
  }
  mnst20Predict(){
    let objectToSend = {
      "Mobility" : 2,
      "Mode_of_feeding" : 1,
      "Health_status" : 0.5,
      "BMI" : 1,
      "ADE" : 0,
      "Impared_nutritional_status" : 3.0,
      "Severity_disease" : 0,
      "Score" : 7.5
    }
    this.commonService.loader(true);
    this.commonService.apiCall('post','form/prediction?form_name=mnst20',objectToSend).subscribe(
      data=>{
        this.commonService.loader(false);
        if(data['success']){
          this.mnst20Result = data['result']
        }else{

          this.iziToast.warning({
            title: 'Warning',
            message: data['message'],
            position: 'topCenter'
          });
        }
      },
      error =>{
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
