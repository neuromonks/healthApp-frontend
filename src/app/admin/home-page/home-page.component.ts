import { Component, OnInit } from '@angular/core';
import {CommonService,AuthService} from "../../services";
import {Ng2IzitoastService} from "ng2-izitoast";
import { GoogleChartInterface } from 'ng2-google-charts';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  allInactiveUser=[];
  dtOptions: any = {};
  dashboardData=null;
  pieChart:GoogleChartInterface ;
  comorbityChart:GoogleChartInterface ;
   userData:any;
   isAdmin=false;

  constructor(private iziToast: Ng2IzitoastService ,
              private commonService:CommonService,
              private authService: AuthService) { }


  ngOnInit() {
    this.isAdmin = this.authService.isAdmin();
    this.userData = this.authService.getUserInfo();
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      dom: 'Bfrtip',
      buttons: [

      ]
    };
    this.getInactiveUsers();
    this.getDashboardData();
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

  getDashboardData(){
    this.commonService.loader(true);
    this.commonService.apiCall('get','user/comorbity-stat').subscribe(
      data=>{
        if(data['success']){
          console.log(data)
          this.dashboardData=data['result']
          this.commonService.loader(false);
          this.pieChart  = {
          chartType: 'PieChart',
          dataTable: [
            ['Lable', 'Count'],
           this.dashboardData['maleFemaleRation'][0],
           this.dashboardData['maleFemaleRation'][1]
          ],
          //firstRowIsData: true,
          options: {'title': ''},
        };

        this.comorbityChart ={
          chartType: 'ColumnChart',
          dataTable: this.dashboardData['comorbityData'],
          firstRowIsData: true,
          options: {'title': ''},
        }; 
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
