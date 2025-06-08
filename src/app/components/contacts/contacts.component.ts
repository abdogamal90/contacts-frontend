import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { ContactsService } from '../../services/contacts.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Contact {
  _id: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
}
@Component({
  selector: 'app-contacts',
  imports: [FormsModule, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  page = 1;
  pageSize = 5;

  constructor(private contactsService: ContactsService) {}

  ngOnInit() {
    this.loadContacts();
  }

  loadContacts() {
    this.contactsService.getContacts(this.page, this.pageSize).subscribe(data => {
      this.contacts = data.contacts;
      console.log('Contacts loaded:', this.contacts);
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

}
