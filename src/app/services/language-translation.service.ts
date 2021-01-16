import { Injectable } from '@angular/core';
import {ENGLISH , MARATHI} from "./translations";
import {CommonService} from "./common.service";

@Injectable({
  providedIn: 'root'
})
export class LanguageTranslationService {

  currentLanguae='english';
  private languageData: any;
  constructor(
    private commonService:CommonService
  ) {

    this.languageData=ENGLISH;
    this.commonService.subscribe('language',(value) => {
      if(value['type']=='language'){
        console.log('langu',value)
        if(value['payload']){
          this.languageData= MARATHI;
        }else{
          this.languageData = ENGLISH;
        }
      }

    });

  }

  translate(text){
    let originaText=text;

    text=text.toLowerCase().trim();
    // console.log(text,this.languageData.hasOwnProperty('create follow up'),this.languageData['create follow up'])

    if (this.languageData && this.languageData.hasOwnProperty(text) && this.languageData[text].length>0) {
      // console.log(this.languageData[text])
      return this.languageData[text];
    } else {
      // console.log(text,this.languageData[text]);
      return originaText;
    }
  }


}
