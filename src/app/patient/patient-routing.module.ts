import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {MustFormComponent} from "./must-form/must-form.component";
import {HomePageComponent} from "./home-page/home-page.component";
import {PatientComponent} from "./patient.component";
import {NrsFormComponent} from "./nrs-form/nrs-form.component";
import {MnaFormComponent} from "./mna-form/mna-form.component";

const routes: Routes = [{
  path:'',
  component:PatientComponent,
  children:[
    {
      path:'',
      component:HomePageComponent
    },
    {
      path:'mustForm',
      component:MustFormComponent
    },
    {
      path:'nrsForm',
      component:NrsFormComponent
    },
    {
      path:'mnaForm',
      component:MnaFormComponent
    },


  ]
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PatientRoutingModule {

}
