import { Component, OnInit } from '@angular/core';
import {Ng2IzitoastService} from "ng2-izitoast";
import {CommonService} from "../../services";
import {ActivatedRoute} from "@angular/router";

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
  previousNRSData=[];
  previousMNSTData=[];
  constructor(private iziToast: Ng2IzitoastService ,
              private commonService:CommonService,
              private activatedRoute: ActivatedRoute) {

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
