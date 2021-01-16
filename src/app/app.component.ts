import { Component, OnInit } from '@angular/core';
import { CommonService } from  './services';
import { ngxLoadingAnimationTypes, NgxLoadingComponent } from  'ngx-loading';


declare const App: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'angular';
  loading = false;
  ngxLoadingAnimationTypes1 = ngxLoadingAnimationTypes;
  primaryColour ='#0da326';

  constructor(
  	private commonService : CommonService
  	) { }

  ngOnInit() {
    App.initialLoadPage();
    this.commonService.subscribe("loader", (value) => {
      console.log("loader")
      if(value['type']=='loader') {
        if (value['payload']) {
          this.loading = true;
        } else {
          this.loading = false;
        }
      }
     });
  }
}
