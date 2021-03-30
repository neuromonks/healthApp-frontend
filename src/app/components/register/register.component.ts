import {Component, OnInit, TemplateRef} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Ng2IzitoastService} from "ng2-izitoast";
import {Router} from "@angular/router";
import {AuthService, CommonService} from "../../services";
import {IAngularMyDpOptions, IMyDateModel,IMyDate,DefaultView  } from 'angular-mydatepicker';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  modalRef: BsModalRef;
  todayMyDate:IMyDate  = {year:new Date().getFullYear()-17,month:new Date().getMonth()+1,day:new Date().getDate()}
  // defaultMyDate:DefaultView  = {day:new Date().getDate(),month:new Date().getMonth()+1,year:new Date().getFullYear()-17}
  myOptions: IAngularMyDpOptions = {
    dateRange: false,
    minYear : 1900,
    maxYear : new Date().getFullYear()-17,
    dateFormat: 'dd-mm-yyyy',
    disableSince : this.todayMyDate,
    // defaultView : this.defaultMyDate
  };
  allHospital=[]
  years = [];
  months = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  days = ['01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31']
  constructor(
    private builder: FormBuilder,
    private iziToast: Ng2IzitoastService ,
    private router: Router,
    private commonService :  CommonService,
    private authService: AuthService,
    private modalService: BsModalService,
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
      // dob : [this.todayMyDate,[Validators.required,]],
      year : ['',[Validators.required]],
      month : ['',[Validators.required]],
      day : ['',[Validators.required]],
      address:['',[Validators.required,]],
      height:['',[Validators.required,]],
      weight:['',[Validators.required,]],
      gender:['male',[Validators.required,]],
      agreement_check:[false,[Validators.required,]],
      hospital_id:['']
    });
    // this.form.patchValue({dob: {
    //     date: {
    //       year: new Date().getFullYear()-17,
    //       month: new Date().getMonth() + 1,
    //       day: new Date().getDate()}
    //   }});
    this.getAllHospital();

    let currentYearStart = new Date().getFullYear()-17;
    for(let i=0;i<110;i++){
      this.years.push(currentYearStart-i);
    }
  }

  openModal(template: TemplateRef<any>) {
    console.log(template)
    this.modalRef = this.modalService.show(template);
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
    objectToSend['dob']=this.form.value['day']+this.form.value['month']+this.form.value['year'];
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
