import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ContactsService } from '../../../services/contacts.service';
import { Contact } from '../../../model/Contact';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-edit-contact',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './edit-contact.component.html',
  styleUrl: './edit-contact.component.scss'
})
export class EditContactComponent implements OnInit {
  contact: Contact = {
    name: '',
    phone: '',
    address: '',
    notes: ''
  };
  contactForm: FormGroup;


  constructor(
    private contactsService: ContactsService, 
    private route: ActivatedRoute,
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

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contactsService.getContactById(id).subscribe((data) => {
        this.contact = data;
        // Populate the form with contact data
        this.contactForm.patchValue({
          name: data.name,
          phone: data.phone,
          address: data.address,
          notes: data.notes
        });
      });
    }
  }
  
  editContact() {
    // Mark all fields as touched to show validation errors
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });

    if (this.contactForm.invalid) {
      this.notification.warning('Please fill in all required fields correctly.');
      return;
    }

    const updatedContact = {
      ...this.contact,
      ...this.contactForm.value
    };

    this.contactsService.editContact(updatedContact).subscribe(
      () => {
        this.notification.success('Contact updated successfully!');
        this.router.navigate(['/contacts']);
      }, 
      error => {
        console.error('Error updating contact:', error);
        this.notification.handleError(error, 'Failed to update contact. Please try again.');
      }
    );
  }

  cancelEdit() {
    this.router.navigate(['/contacts']);
  }

}
