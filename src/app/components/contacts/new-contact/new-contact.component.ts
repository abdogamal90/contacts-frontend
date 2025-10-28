import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ContactsService } from '../../../services/contacts.service';
import { Contact } from '../../../model/Contact';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-new-contact',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './new-contact.component.html',
  styleUrl: './new-contact.component.scss'
})
export class NewContactComponent {
  contact: Contact = {
    name: '',
    phone: '',
    address: '',
    notes: ''
  };
  contactForm: FormGroup;

  constructor(
    private contactsService: ContactsService, 
    private router: Router,
    private notification: NotificationService
  ) {
    this.contactForm = new FormGroup({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      phone: new FormControl('', [
        Validators.required, 
        Validators.pattern('^[0-9]+$'),
        Validators.minLength(10),
        Validators.maxLength(15)
      ]),
      address: new FormControl('', [
        Validators.required,
        Validators.maxLength(200)
      ]),
      notes: new FormControl('', [
        Validators.maxLength(500)
      ])
    });
  }

  createContact() {
    // Mark all fields as touched to show validation errors
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });

    if (this.contactForm.invalid) {
      this.notification.warning('Please fill in all required fields correctly');
      return;
    }

    this.contactsService.createContact(this.contactForm.value).subscribe(
      (createdContact) => {
        this.notification.success(`Contact "${createdContact.name}" created successfully!`);
        this.router.navigate(['/contacts']);
      }, 
      error => {
        this.notification.handleError(error, 'Failed to create contact');
      }
    );
  }
}
