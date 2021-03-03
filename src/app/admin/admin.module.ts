import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { SharedsModule } from '../shareds/shareds.module';
import { AdminComponent } from './admin.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule } from '@angular/forms';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { ExportAsModule } from 'ngx-export-as';
import { HomePageComponent } from './home-page/home-page.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { PatientsComponent } from './patients/patients.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { HospitalComponent } from './hospital/hospital.component';
import { PatientDetailsComponent } from './patient-details/patient-details.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';

@NgModule({
  declarations: [AdminComponent, HomePageComponent, DoctorsComponent, PatientsComponent, HospitalComponent, PatientDetailsComponent, ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedsModule,
    DataTablesModule,
    FormsModule,
    AngularMyDatePickerModule,
    ExportAsModule,
    ModalModule.forRoot(),
    Ng2GoogleChartsModule
  ]
})
export class AdminModule { }
