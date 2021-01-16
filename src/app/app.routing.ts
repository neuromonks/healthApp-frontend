import {Routes , RouterModule} from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { AppURL } from './app.url';
import {RegisterComponent} from "./components/register/register.component";
import {InactiveComponent} from "./components/inactive/inactive.component";


const RouteList: Routes = [
    {path : '' , redirectTo: AppURL.Login , pathMatch: 'full'},
    {path : AppURL.Login, component: LoginComponent},
    {path:'register',component:RegisterComponent},
    {path:'inactive',component:InactiveComponent},
    {path: 'admin', loadChildren: './admin/admin.module#AdminModule'},
    {path: 'patient', loadChildren: './patient/patient.module#PatientModule'}

];

export const AppRouting = RouterModule.forRoot(RouteList);

