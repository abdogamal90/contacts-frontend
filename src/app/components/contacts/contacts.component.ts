import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ContactsService } from '../../services/contacts.service';
import { FormGroup, FormsModule, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { Contact } from '../../model/Contact';
import { ReactiveFormsModule } from '@angular/forms';
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

  filters = {
    name: '',
    phone: '',
    address: ''
  };

  constructor(private contactsService: ContactsService, private router: Router) {
    this.contactForm = new FormGroup({
      name: new FormControl(this.editingContact ? this.editingContact.name : ''),
      phone: new FormControl(this.editingContact ? this.editingContact.phone : '',Validators.pattern('^[0-9]+$')),
      address: new FormControl(this.editingContact ? this.editingContact.address : ''),
      notes: new FormControl(this.editingContact ? this.editingContact.notes : '')
    });
  }

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    const params: any = {
      ...this.filters,
      page: this.page,
      limit: this.pageSize,
    };

    this.contactsService.getContacts(this.filters, this.page, this.pageSize).subscribe(data => {
      this.contacts = data.contacts;
      this.totalPages = data.totalPages;
      this.page = data.page;
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
        this.contactsService.deleteContact(contact._id).subscribe(() => {
          alert('Deleted!');
          this.loadContacts();
        });
      } else {
        alert('Contact ID is missing.');
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
    this.editingContact = { ...contact };

    this.contactForm = new FormGroup({
      name: new FormControl(contact.name, Validators.required),
      phone: new FormControl(contact.phone, [Validators.required, Validators.pattern('^[0-9]+$')]),
      address: new FormControl(contact.address),
      notes: new FormControl(contact.notes),
    });
  }

  cancelEdit() {
    this.editingContact = null;
  }

  saveContact() {
    if (!this.editingContact || this.contactForm.invalid) return;

    const updatedContact = {
      ...this.editingContact,
      ...this.contactForm.value
    };

    this.contactsService.editContact(updatedContact).subscribe(
      updated => {
        this.contacts = this.contacts.map(c => c._id === updated._id ? updated : c);
        this.editingContact = null;
      },
      err => {
        console.error('Update failed', err);
      }
    );
  }
  logout() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
