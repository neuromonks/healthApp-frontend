import { Component, OnInit } from '@angular/core';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {IAngularMyDpOptions} from "angular-mydatepicker";
import {Ng2IzitoastService} from "ng2-izitoast";
import {CommonService} from "../../services";

@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.css']
})
export class HospitalComponent implements OnInit {
  dtOptions: any = {};
  modalRef: BsModalRef;
  form: FormGroup;
  submitted = false;
  isEdit = false;
  allHospital = [];
  indexFoEdit=-1;

  myOptions: IAngularMyDpOptions = {
    dateRange: false,
    dateFormat: 'dd-mm-yyyy'
  };
  constructor(private iziToast: Ng2IzitoastService ,
              private builder: FormBuilder,
              private commonService:CommonService,
              private modalService: BsModalService) { }

  ngOnInit() {
    this.form = this.builder.group({
      name: ['', [Validators.required]],
      website: ['', [Validators.required,]],
      address: ['', [Validators.required,]],
    });
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      dom: 'Bfrtip',
      buttons: [

      ]
    };
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
    console.log(this.isEdit)
    if(this.isEdit){
      let dummyObject = {};
      dummyObject['id']= this.allHospital[this.indexFoEdit]['id'];
      dummyObject['update']=objectToSend;
      console.log(dummyObject)
      this.commonService.loader(true);
      this.commonService.apiCall('post','update_hospital',dummyObject).subscribe(
        data=>{
          this.commonService.loader(false);
          console.log(data)
          if(data['success']){
            this.iziToast.success({
              title: 'Success',
              message: data['message'],
              position: 'topCenter'
            });
            this.getAllHospital();
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
      this.commonService.loader(true);
      this.commonService.apiCall('post','hospital',objectToSend).subscribe(
        data=>{
          this.commonService.loader(false);
          console.log(data)
          if(data['success']){
            this.iziToast.success({
              title: 'Success',
              message: data['message'],
              position: 'topCenter'
            });
            this.getAllHospital();
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

  editData(index){
    this.indexFoEdit = index;
    this.isEdit = true;
    this.form.patchValue({
      address:this.allHospital[index]['address'],
      name:this.allHospital[index]['name'],
      website:this.allHospital[index]['website'],
    })
  }

  clearForm(){
    this.isEdit= false;
    this.form.reset();
  }

}
