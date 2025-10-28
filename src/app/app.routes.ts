import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { authGuard } from './guards/auth.guard';
import { NewContactComponent } from './components/contacts/new-contact/new-contact.component';
import { EditContactComponent } from './components/contacts/edit-contact/edit-contact.component';
import { ProfileComponent } from './profile/profile.component';
import { WelcomePageComponent } from './components/welcome-page/welcome-page.component';
export const routes: Routes = [
  { path: '', component: WelcomePageComponent },
  { path: 'login', component: LoginComponent },
  { path: 'contacts', component: ContactsComponent, canActivate: [authGuard] },
  { path: 'contacts/add', component: NewContactComponent, canActivate: [authGuard] },
  { path: 'contacts/edit/:id', component: EditContactComponent, canActivate: [authGuard] },
  { path: 'profile', component: ProfileComponent, canActivate: [authGuard] }
];
