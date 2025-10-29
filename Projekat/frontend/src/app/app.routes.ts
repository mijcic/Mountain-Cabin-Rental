import { Routes } from '@angular/router';
import { VtRegisterComponent } from './vt-register/vt-register.component';
import { LoginComponent } from './login/login.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { TuristaComponent } from './turista/turista.component';
import { AdministratorComponent } from './administrator/administrator.component';
import { LoginAdministratorComponent } from './login-administrator/login-administrator.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { NeregistrovaniComponent } from './neregistrovani/neregistrovani.component';
import { VikendicaDetaljiComponent } from './vikendica-detalji/vikendica-detalji.component';

export const routes: Routes = [
    {path: "", component: NeregistrovaniComponent},
    {path: "login", component: LoginComponent},
    {path: "loginAdministrator", component: LoginAdministratorComponent},
    {path: "vtregister", component: VtRegisterComponent},
    {path: "vlasnik", component: VlasnikComponent},
    {path: "turista", component: TuristaComponent},
    {path: "administrator", component: AdministratorComponent},
    {path: "changePassword", component: ChangePasswordComponent},
    {path: "vikendica/:naziv", component: VikendicaDetaljiComponent},
];
