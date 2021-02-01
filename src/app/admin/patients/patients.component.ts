import {Component, OnInit, TemplateRef} from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IAngularMyDpOptions,IMyDateModel} from "angular-mydatepicker";
import {Ng2IzitoastService} from "ng2-izitoast";
import {AuthService, CommonService} from "../../services";

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {
  allInactiveUser=[];
  dtOptions: any = {};
  modalRef: BsModalRef;
  form: FormGroup;
  submitted = false;
  isEdit = false;
  allHospital = []
  viewOnly=false;
  selectedIndex=-1;
  userData:any;
  myOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy'
  };

  constructor(private iziToast: Ng2IzitoastService ,
              private builder: FormBuilder,
              private commonService:CommonService,
              private modalService: BsModalService,
              private authService:AuthService) { }

  ngOnInit() {
    this.userData = this.authService.getUserInfo();
    this.form = this.builder.group({
      email: ['', [Validators.required,Validators.pattern('^[^\\s@]+@[^\\s@]+\\.[^\\s@]{2,}$')]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', [Validators.required,]],
      lastName: ['', [Validators.required,]],
      user_type : ['patient', []],
      mobile : ['', [Validators.required,]],
      dob : ['',[Validators.required,]],
      address : ['',[Validators.required,]],
      gender:['male',[Validators.required,]],
      agreement_check:[true,[]],

    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      dom: 'Bfrtip',
      buttons: [

      ]
    };

    this.getInactiveUsers();
    this.getAllHospital();
  }

  getAllHospital(){
    this.commonService.loader(true);
    this.commonService.apiCall('get','hospital').subscribe(
      data=>{
        if(data['success']){
          console.log(data)
          this.allHospital = data['result'];
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

  getInactiveUsers(){
    this.allInactiveUser=[];
    this.commonService.loader(true);
    this.commonService.apiCall('get','user_list?user_type=patient').subscribe(
      data=>{
        if(data['success']){
          console.log(data)
          if(this.userData['user_type']=='doctor'){
            for(let user of data['result']){
              if(user['user_type']=='patient' && user['hospital_id']==this.userData['hospital_id']){
                this.allInactiveUser.push(user);
              }
            }
          }else{
            for(let user of data['result']){
              if(user['user_type']=='patient'){
                this.allInactiveUser.push(user);
              }
            }
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

  allowUser(index){
    this.commonService.apiCall('post','',this.allInactiveUser[index]).subscribe(
      data=>{
        if(data['success']){
          console.log(data)
          this.commonService.loader(false);
          this.getInactiveUsers();
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

  openModal(template: TemplateRef<any>) {
    console.log(template)
    this.modalRef = this.modalService.show(template);
  }

  closeModal(){
    document.getElementById('closeModal').click();
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
    objectToSend['user_type']='doctor'
    this.commonService.loader(true);
    if(this.isEdit){
      delete objectToSend['password']
      let newObjectToSend = {'email':this.allInactiveUser[this.selectedIndex]['email'],'update':objectToSend}
      this.commonService.apiCall('put','update_profile',newObjectToSend).subscribe(
        data=>{
          this.commonService.loader(false);
          console.log(data)
          if(data['success']){
            this.iziToast.success({
              title: 'Success',
              message: data['message'],
              position: 'topCenter'
            });
            this.closeModal();
            this.clearForm();
            this.getInactiveUsers();
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
    }else{
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
            this.closeModal();
            this.clearForm();
            this.getInactiveUsers();
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

  edit(index){
    this.isEdit = true;
    this.viewOnly = false;
    this.selectedIndex=index;
    let model: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date(this.allInactiveUser[index]['dob'])}, dateRange: null};
    this.form.patchValue({
      email: this.allInactiveUser[index]['email'],
      password: '123456',
      firstName: this.allInactiveUser[index]['name'].split(' ')[0],
      lastName: this.allInactiveUser[index]['name'].split(' ')[1],
      user_type : 'patient',
      mobile : this.allInactiveUser[index]['mobile'],
      dob : model,
      address : this.allInactiveUser[index]['address'],
      gender:this.allInactiveUser[index]['gender'],
      hospital_id:this.allInactiveUser[index]['hospital_id'],
      agreement_check:true
    });
  }

  details(index){
    this.isEdit = true;
    this.viewOnly = true;
    this.selectedIndex =index;
    let model: IMyDateModel = {isRange: false, singleDate: {jsDate: new Date(this.allInactiveUser[index]['dob'])}, dateRange: null};
    this.form.patchValue({
      email: this.allInactiveUser[index]['email'],
      password: '123456',
      firstName: this.allInactiveUser[index]['name'].split(' ')[0],
      lastName: this.allInactiveUser[index]['name'].split(' ')[1],
      user_type : 'patient',
      mobile : this.allInactiveUser[index]['mobile'],
      dob : model,
      address : this.allInactiveUser[index]['address'],
      gender:this.allInactiveUser[index]['gender'],
      hospital_id:this.allInactiveUser[index]['hospital_id'],
      agreement_check:true
    });
  }

  clearForm(){
    this.viewOnly = false;
    this.isEdit= false;
    this.form.reset();
  }

  hospitalName(id){
    let hospitalName = '';

    for( let eachHospital of this.allHospital){
      if(eachHospital['id']==id){
        hospitalName=eachHospital['name'];
        break;
      }
    }
    return hospitalName;
  }

}
