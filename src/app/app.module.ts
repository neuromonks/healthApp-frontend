import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BsDropdownModule, ModalModule} from 'ngx-bootstrap';
import { LoginComponent } from './components/login/login.component';
import { AppRouting } from './app.routing';
import { SharedsModule } from './shareds/shareds.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/authconfig.interceptor';
import { DataTablesModule } from 'angular-datatables';
import { NgxLoadingModule } from 'ngx-loading';
import {NgxImageCompressService} from 'ngx-image-compress';
import { AngularMyDatePickerModule } from 'angular-mydatepicker';
import { ExportAsModule } from 'ngx-export-as';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { RegisterComponent } from './components/register/register.component';
import { InactiveComponent } from './components/inactive/inactive.component';
import { PatientConsentComponent } from './components/patient-consent/patient-consent.component';
import { AdminConsentComponent } from './components/admin-consent/admin-consent.component';
import { DoctorConsentComponent } from './components/doctor-consent/doctor-consent.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    InactiveComponent,
    PatientConsentComponent,
    AdminConsentComponent,
    DoctorConsentComponent,
    ForgotPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AppRouting,
    SharedsModule,
    HttpClientModule,
    DataTablesModule,
    NgxLoadingModule.forRoot({}),
    AngularMyDatePickerModule,
    ExportAsModule,
    AngularFireModule.initializeApp(environment.firebase),
    ModalModule.forRoot(),
    Ng2GoogleChartsModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },NgxImageCompressService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
