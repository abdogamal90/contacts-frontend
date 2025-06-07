import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

interface Contact {
  _id: string;
  name: string;
  phone: string;
  address: string;
  notes: string;
}
@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private apiUrl = 'http://localhost:3000/api/contacts';

  


  constructor(private http: HttpClient, private router: Router) { }

  getContacts(page: number, limit: number): Observable<{ contacts: Contact[]; totalContacts: number; totalPages: number; page: number;}> {
    return this.http.get<{ contacts: Contact[]; totalContacts: number; totalPages: number; page: number; }>(this.apiUrl, { params: { page, limit } });
  }
}