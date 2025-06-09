import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { ContactsService } from '../../../services/contacts.service';
import { Contact } from '../../../model/Contact';
import { FormGroup, FormControl, Validators } from '@angular/forms';

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

  constructor(private contactsService: ContactsService, private router: Router) {
    this.contactForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+$')]),
      address: new FormControl('', [Validators.required]),
      notes: new FormControl('')
    });
  }

  errorMessage: string | null = null;

  createContact() {
    if (this.contactForm.valid) {
      this.contactsService.createContact(this.contactForm.value).subscribe(() => {
        this.router.navigate(['/contacts']);
      }, error => {
        this.errorMessage = 'Failed to create contact. Please try again later.';
      });
    } else {
      if (this.contactForm.get('name')?.invalid) {
        this.errorMessage = 'Name is required.';
      }
      else if (this.contactForm.get('phone')?.invalid) {
        this.errorMessage = 'Phone is required and must be numeric.';
      }
      else if (this.contactForm.get('address')?.invalid) {
        this.errorMessage = 'Address is required.';
      }
      else {
        this.errorMessage = 'Please fill out the form correctly.';
      }
    }
  }
}
