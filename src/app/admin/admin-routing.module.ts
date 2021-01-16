import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import {HomePageComponent} from "./home-page/home-page.component";
import {DoctorsComponent} from "./doctors/doctors.component";
import {PatientsComponent} from "./patients/patients.component";
import {HospitalComponent} from "./hospital/hospital.component";

const routes: Routes = [{
  path:'',
  component:AdminComponent,
  children:[
        {
          path:'',
          component:HomePageComponent
        },
        {
          path:'doctor',
          component:DoctorsComponent
        },
        {
          path:'patient',
          component:PatientsComponent
        },
        {
          path:'hospital',
          component:HospitalComponent
        }

      ]
    }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
