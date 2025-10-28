import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ContactsService } from '../../services/contacts.service';
import { FormGroup, FormsModule, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Contact } from '../../model/Contact';
import { ReactiveFormsModule } from '@angular/forms';
import { SocketService } from '../../services/socket.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-contacts',
  imports: [FormsModule, CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  page = 1;
  pageSize = 5;
  totalPages = 1;
  editingContact: Contact | null = null;
  contactForm: FormGroup = new FormGroup({});
  contactId: string ='';
  isLocked = false;
  lockedBy: string = ''
  lockedContacts: { [key: string]: string } = {};
  username = localStorage.getItem('username') || 'user1'; // Default username if not set
  
  filters = {
    name: '',
    phone: '',
    address: ''
  };

  constructor(
    private contactsService: ContactsService, 
    private router: Router, 
    private socketService: SocketService,
    private notification: NotificationService
  ) {
    this.contactForm = new FormGroup({
      name: new FormControl(this.editingContact ? this.editingContact.name : ''),
      phone: new FormControl(this.editingContact ? this.editingContact.phone : '',Validators.pattern('^[0-9]+$')),
      address: new FormControl(this.editingContact ? this.editingContact.address : ''),
      notes: new FormControl(this.editingContact ? this.editingContact.notes : '')
    });
  }

  ngOnInit() {
    this.loadContacts();
    this.socketService.onEditingStatusChanged((data) => {
      if (data.isEditing) {
        this.lockedContacts[data.contactId] = data.username;
      } else {
        delete this.lockedContacts[data.contactId];
      }

      // If you're editing this contact and it's locked by someone else, update isLocked state
      if (this.editingContact && this.editingContact._id === data.contactId) {
        this.isLocked = data.username !== this.username;
        this.lockedBy = data.username;
      }
    });
  }

  loadContacts() {
    const params: any = {
      ...this.filters,
      page: this.page,
      limit: this.pageSize,
    };

    this.contactsService.getContacts(this.filters, this.page, this.pageSize).subscribe({
      next: (data) => {
        this.contacts = data.contacts;
        this.totalPages = data.totalPages;
        this.page = data.page;
      },
      error: (error) => {
        // Error is already handled by the interceptor
        // Just reset the contacts array
        this.contacts = [];
        this.totalPages = 1;
        this.page = 1;
      }
    });
  }

  nextPage() {
    this.page++;
    this.loadContacts();
  }

  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.loadContacts();
    }
  }

  // editContact(contact: Contact) {
  //   this.router.navigate(['/contacts/edit', contact._id]);
  // }

  deleteContact(contact: Contact) {
    if (confirm(`Delete contact ${contact.name}?`)) {
      if (contact._id) {
        this.contactsService.deleteContact(contact._id).subscribe(
          () => {
            this.notification.success(`Contact "${contact.name}" deleted successfully!`);
            this.loadContacts();
          }, 
          error => {
            this.notification.handleError(error, 'Failed to delete contact');
          }
        );
      } else {
        this.notification.error('Contact ID is missing');
      }
    }
  }

  addContact() {
    this.router.navigate(['/contacts/add']);
  }

  onFilterChange() {
    this.page = 1;
    this.loadContacts();
  }


  startEdit(contact: Contact) {
     if (this.isLocked && this.lockedBy !== this.username) {
      this.notification.warning(`This contact is being edited by ${this.lockedBy}`);
      return;
    }
    this.editingContact = { ...contact };
    // Notify the socket service that editing has started
    if (!contact._id) {
      this.notification.error('Contact ID is missing');
      return;
    }
    this.contactId = contact._id;
    this.socketService.startEditing(contact._id, this.username);
    
    this.contactForm = new FormGroup({
      name: new FormControl(contact.name, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50)
      ]),
      phone: new FormControl(contact.phone, [
        Validators.required, 
        Validators.pattern('^[0-9]+$'),
        Validators.minLength(10),
        Validators.maxLength(15)
      ]),
      address: new FormControl(contact.address, [
        Validators.maxLength(200)
      ]),
      notes: new FormControl(contact.notes, [
        Validators.maxLength(500)
      ]),
    });
    
    // Auto-focus the first field
    setTimeout(() => {
      const firstInput = document.querySelector('.edit-form input') as HTMLInputElement;
      if (firstInput) firstInput.focus();
    }, 100);
  }

  cancelEdit() {
    if (this.contactForm.dirty && !confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return;
    }
    this.editingContact = null;
    this.socketService.stopEditing(this.contactId);
    this.isLocked = false;
  }

  saveContact() {
    if (!this.editingContact) return;
    
    // Mark all fields as touched to show validation errors
    Object.keys(this.contactForm.controls).forEach(key => {
      this.contactForm.get(key)?.markAsTouched();
    });

    if (this.contactForm.invalid) {
      this.notification.warning('Please fix the validation errors before saving');
      return;
    }

    const updatedContact = {
      ...this.editingContact,
      ...this.contactForm.value
    };

    this.contactsService.editContact(updatedContact).subscribe(
      updated => {
        this.contacts = this.contacts.map(c => c._id === updated._id ? updated : c);
        this.editingContact = null;
        this.socketService.stopEditing(this.contactId);
        this.isLocked = false;
        this.notification.success(`Contact "${updated.name}" updated successfully!`);
      },
      error => {
        this.notification.handleError(error, 'Failed to update contact');
      }
    );
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
