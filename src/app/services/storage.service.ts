import { Injectable } from '@angular/core';
// import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  storeData(data:Object){
  	let storeData = {};
  	if(localStorage.getItem('appData')){
  		storeData = JSON.parse(localStorage.getItem('appData'));
  	}
  	storeData[data['id']]=data;
  	localStorage.setItem('appData',JSON.stringify(storeData));
  }

  getStoreData(id:string){
  	let storeData:any;
  	if(localStorage.getItem('appData')){ 
  		storeData = JSON.parse(localStorage.getItem('appData'))
  		if(storeData.hasOwnProperty(id)){
  			return storeData[id];
  		}
  	}
  	return false;
  }

  removeStoreData(){
    if(localStorage.getItem('appData')){ 
       localStorage.removeItem('appData');
    }
  }

  removeSelectedKeys(keys=[]){
    let storeData:any;
    if(localStorage.getItem('appData')){ 
      storeData = JSON.parse(localStorage.getItem('appData'))
      for(let key of keys){
        if(storeData.hasOwnProperty(key)){
          delete storeData[key];
        }
      }
    }
    localStorage.setItem('appData',JSON.stringify(storeData));
  }



}
