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
    notes: '',
    tags: [],
    category: null,
    isFavorite: false
  };
  contactForm: FormGroup;
  
  // Tag management
  newTag: string = '';
  selectedTags: string[] = [];
  existingTags: string[] = [];

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
      ]),
      category: new FormControl(null),
      isFavorite: new FormControl(false)
    });
    
    // Load existing tags
    this.loadExistingTags();
  }
  
  loadExistingTags() {
    this.contactsService.getTags().subscribe({
      next: (data) => { this.existingTags = data.tags || []; },
      error: () => { this.existingTags = []; }
    });
  }
  
  addTag() {
    const tag = this.newTag.trim().toLowerCase();
    
    if (!tag) {
      this.notification.warning('Please enter a tag');
      return;
    }
    
    if (tag.length > 20) {
      this.notification.warning('Tag cannot exceed 20 characters');
      return;
    }
    
    if (this.selectedTags.includes(tag)) {
      this.notification.info('Tag already added');
      return;
    }
    
    if (this.selectedTags.length >= 10) {
      this.notification.warning('Maximum 10 tags allowed per contact');
      return;
    }
    
    this.selectedTags.push(tag);
    this.newTag = '';
    this.notification.success(`Tag "${tag}" added`);
  }
  
  removeTag(tag: string) {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
  }
  
  toggleExistingTag(tag: string) {
    const index = this.selectedTags.indexOf(tag);
    if (index === -1) {
      if (this.selectedTags.length >= 10) {
        this.notification.warning('Maximum 10 tags allowed per contact');
        return;
      }
      this.selectedTags.push(tag);
    } else {
      this.selectedTags.splice(index, 1);
    }
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

    const contactData = {
      ...this.contactForm.value,
      tags: this.selectedTags,
      category: this.contactForm.value.category || null,
      isFavorite: this.contactForm.value.isFavorite || false
    };

    this.contactsService.createContact(contactData).subscribe(
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
