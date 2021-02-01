import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientRoutingModule } from './patient-routing.module';
import { MustFormComponent } from './must-form/must-form.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PatientComponent } from './patient.component';
import {SharedsModule} from "../shareds/shareds.module";
import {DataTablesModule} from "angular-datatables";
import {FormsModule} from "@angular/forms";
import {AngularMyDatePickerModule} from "angular-mydatepicker";
import {ExportAsModule} from "ngx-export-as";
import {ModalModule} from "ngx-bootstrap/modal";
import { NrsFormComponent } from './nrs-form/nrs-form.component';
import { MnaFormComponent } from './mna-form/mna-form.component';
import { Mnst20Component } from './mnst20/mnst20.component';

@NgModule({
  declarations: [MustFormComponent, HomePageComponent, PatientComponent, NrsFormComponent, MnaFormComponent, Mnst20Component],
  imports: [
    CommonModule,
    PatientRoutingModule,
    SharedsModule,
    DataTablesModule,
    FormsModule,
    AngularMyDatePickerModule,
    ExportAsModule,
    ModalModule.forRoot()
  ]
})
export class PatientModule { }
