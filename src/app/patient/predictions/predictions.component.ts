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
  userData:any;
  userId ;
  mnaResult = null;
  nrsResult = null;
  mnst20Result = null;
  mustResult = null;
  previousData={'must':[],'nrs':[],'mna':[]};
  constructor(private iziToast: Ng2IzitoastService ,
              private commonService:CommonService,
              private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(paramsId => {
      this.userId = paramsId.id;
      console.log(this.userId);
      this.checkPreviousData();
    });

  }

  mnaPredict(){
    if(this.previousData['mna'].length==0){
      this.iziToast.info({
        title: 'Info',
        message: "MNA Form Data Not Available Please fill it first",
        position: 'topCenter'
      });
      this.commonService.navigateTo('/patient/mnaForm');
      return;
    }
    let objectToSend = {
      "total_score":this.previousData['mna'][0]['finalScore']
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
    if(this.previousData['must'].length==0){
      this.iziToast.info({
        title: 'Info',
        message: "MNA Form Data Not Available Please fill it first",
        position: 'topCenter'
      });
      this.commonService.navigateTo('/patient/mustForm');
      return;
    }
    let objectToSend = {
      "total_score":this.previousData['must'][0]['finalScore']
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
    if(this.previousData['nrs'].length==0){
      this.iziToast.info({
        title: 'Info',
        message: "MNA Form Data Not Available Please fill it first",
        position: 'topCenter'
      });
      this.commonService.navigateTo('/patient/nrsForm');
      return;
    }
    let objectToSend = {
      "total_score":this.previousData['nrs'][0]['finalScore']
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
    if(this.previousData['mnst20'].length==0){
      this.iziToast.info({
        title: 'Info',
        message: "MNA Form Data Not Available Please fill it first",
        position: 'topCenter'
      });
      this.commonService.navigateTo('/patient/mnst20Form');
      return;
    }
    let objectToSend = {
      "total_score":this.previousData['mnst20'][0]['finalScore']
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

  checkPreviousData(){
    let today= new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

    this.commonService.loader(true);
    this.commonService.apiCall('get','form/data?patient_id='+this.userId+'&date='+date).subscribe(data=>{
        this.commonService.loader(false);
        if(data['success']){
          this.previousData = data['result'];
          if(this.previousData['must'].length<=0){
            console.log('shubham')
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
}
