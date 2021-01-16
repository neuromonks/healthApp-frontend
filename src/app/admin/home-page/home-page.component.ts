import { Component, OnInit } from '@angular/core';
import {CommonService} from "../../services";
import {Ng2IzitoastService} from "ng2-izitoast";

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  allInactiveUser=[];
  dtOptions: any = {};
  constructor(private iziToast: Ng2IzitoastService ,
              private commonService:CommonService) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      dom: 'Bfrtip',
      buttons: [

      ]
    };
    this.getInactiveUsers();
  }

  getInactiveUsers(){
    this.commonService.loader(true);
    this.commonService.apiCall('get','inactive_user').subscribe(
      data=>{
        if(data['success']){
          console.log(data)
          this.allInactiveUser=data['result']
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
    let dataToSend ={
      "activate":[
      ]
    }
    dataToSend['activate'].push(this.allInactiveUser[index]['email']);
    this.commonService.loader(true);
    this.commonService.apiCall('post','inactive_user',dataToSend).subscribe(
      data=>{
        this.commonService.loader(false);
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

}
