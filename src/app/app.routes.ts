import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { authGuard } from './guards/auth.guard';
import { NewContactComponent } from './components/contacts/new-contact/new-contact.component';
import { EditContactComponent } from './components/contacts/edit-contact/edit-contact.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'contacts', component: ContactsComponent, canActivate: [authGuard] },
  { path: 'contacts/add', component: NewContactComponent, canActivate: [authGuard] },
  { path: 'contacts/edit/:id', component: EditContactComponent, canActivate: [authGuard] }
];
