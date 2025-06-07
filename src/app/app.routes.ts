import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ContactsComponent } from './contacts/contacts.component';
import { authGuard } from './guards/auth.guard';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'contacts', component: ContactsComponent, canActivate: [authGuard] }
];
