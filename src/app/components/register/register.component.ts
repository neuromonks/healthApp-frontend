import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Ng2IzitoastService} from "ng2-izitoast";
import {Router} from "@angular/router";
import {AuthService, CommonService} from "../../services";
import {IAngularMyDpOptions, IMyDateModel} from 'angular-mydatepicker';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  myOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy'
  };
  allHospital=[]

  constructor(
    private builder: FormBuilder,
    private iziToast: Ng2IzitoastService ,
    private router: Router,
    private commonService :  CommonService,
    private authService: AuthService
  ) {

  }



  ngOnInit(){
    this.form = this.builder.group({
      email: ['', [Validators.required,Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required,]],
      lastName: ['', [Validators.required,]],
      user_type : ['patient', [Validators.required,]],
      mobile : ['', [Validators.required,]],
      dob : ['',[Validators.required,]],
      address:['',[Validators.required,]],
      height:['',[Validators.required,]],
      weight:['',[Validators.required,]],
      gender:['male',[Validators.required,]],
      agreement_check:[false,[Validators.required,]],
      hospital_id:['']
    });
    this.getAllHospital();

  }

  getAllHospital(){
    this.commonService.loader(true);
    this.commonService.apiCall('get','hospital').subscribe(
      data=>{
        if(data['success']){
          console.log(data)
          for(let user of data['result']){
            this.allHospital.push(user);
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



  onSubmit() {
    this.submitted = true;
    console.log(this.form.controls)
    if (this.form.invalid) {
      this.iziToast.warning({
        title: 'Error!',
        message: 'Please fill all required fields',
        position: 'topCenter'
      });
      return;
    }

    let objectToSend = JSON.parse(JSON.stringify(this.form.value));
    objectToSend['name']=objectToSend['firstName']+' '+objectToSend['lastName'];
    objectToSend['dob']=this.form.value['dob']['singleDate']['formatted'];
    if(objectToSend['user_type']!='doctor'){
      objectToSend['hospital_id']='';
    }
    this.commonService.loader(true);
    this.commonService.apiCall('post','signup',objectToSend).subscribe(
      data=>{
        this.commonService.loader(false);
        console.log(data)
        if(data['success']){
          this.iziToast.success({
            title: 'Success',
            message: data['message'],
            position: 'topCenter'
          });
        }else{
          this.iziToast.warning({
            title: 'Warning',
            message: data['message'],
            position: 'topCenter'
          });
        }
      },
      error=>{
        this.commonService.loader(false);
        console.log(error);
      }
    );
  }
}
