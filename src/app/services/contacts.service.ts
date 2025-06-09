import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../model/Contact';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private apiUrl = 'http://localhost:3000/api/contacts';

  constructor(private http: HttpClient, private router: Router) {}

  getContacts(
    filters: { name?: string; phone?: string; address?: string },
    page: number,
    limit: number
  ): Observable<{ contacts: Contact[]; totalContacts: number; totalPages: number; page: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params = params.set(key, value);
      }
    });

    return this.http.get<{ contacts: Contact[]; totalContacts: number; totalPages: number; page: number }>(
      this.apiUrl,
      { params }
    );
  }

  createContact(contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  getContactById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  editContact(contact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${contact._id}`, contact);
  }

  deleteContact(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
