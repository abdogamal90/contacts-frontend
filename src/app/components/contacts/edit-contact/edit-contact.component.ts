import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ContactsService } from '../../../services/contacts.service';
import { Contact } from '../../../model/Contact';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-contact',
  imports: [FormsModule, CommonModule, RouterModule],
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


  constructor(private contactsService: ContactsService, private route: ActivatedRoute) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.contactsService.getContactById(id).subscribe((data) => {
        this.contact = data;
      });
    }
  }
  editContact() {
    this.contactsService.editContact(this.contact).subscribe(() => {
      console.log('Contact updated successfully');
    }, error => {
      console.error('Error updating contact:', error);
    });
  }

  cancelEdit() {
    console.log('Edit cancelled');
  }

}
