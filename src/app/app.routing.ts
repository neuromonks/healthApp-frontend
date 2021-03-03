import {Routes , RouterModule} from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AppURL } from './app.url';
import {RegisterComponent} from "./components/register/register.component";
import {InactiveComponent} from "./components/inactive/inactive.component";
import {PatientConsentComponent} from "./components/patient-consent/patient-consent.component";
import {DoctorConsentComponent} from "./components/doctor-consent/doctor-consent.component";
import {ForgotPasswordComponent} from "./components/forgot-password/forgot-password.component";


const RouteList: Routes = [
    {path : '' , redirectTo: AppURL.Login , pathMatch: 'full'},
    {path : AppURL.Login, component: LoginComponent},
    {path:'register',component:RegisterComponent},
  {path:'patientConsent',component:PatientConsentComponent},
  {path:'doctorConsent',component:DoctorConsentComponent},
    {path:'inactive',component:InactiveComponent},
    {path: 'admin', loadChildren: './admin/admin.module#AdminModule'},
    {path: 'patient', loadChildren: './patient/patient.module#PatientModule'},
  {path: 'forgotPassword', component:ForgotPasswordComponent}

];

export const AppRouting = RouterModule.forRoot(RouteList);

