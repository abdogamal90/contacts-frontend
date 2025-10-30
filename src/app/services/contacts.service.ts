import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Contact } from '../model/Contact';

@Injectable({
  providedIn: 'root'
})
export class ContactsService {
  private apiUrl = 'http://localhost:8000/api/contacts';

  constructor(private http: HttpClient, private router: Router) {}

  getContacts(
    filters: { name?: string; phone?: string; address?: string; tags?: string[]; tagLogic?: 'AND'|'OR'; category?: string; isFavorite?: boolean },
    page: number,
    limit: number,
    options?: { sortBy?: string; sortOrder?: 'asc'|'desc' }
  ): Observable<{ contacts: Contact[]; pagination: { total: number; page: number; limit: number; pages: number }; filters: any }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (options?.sortBy) params = params.set('sortBy', options.sortBy);
    if (options?.sortOrder) params = params.set('sortOrder', options.sortOrder);

    Object.entries(filters || {}).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        params = params.set(key, value.join(','));
      } else if (typeof value === 'boolean') {
        params = params.set(key, value ? 'true' : 'false');
      } else {
        params = params.set(key, String(value));
      }
    });

    return this.http.get<{ contacts: Contact[]; pagination: { total: number; page: number; limit: number; pages: number }; filters: any }>(
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

  getTags(): Observable<{ tags: string[] }> {
    return this.http.get<{ tags: string[] }>(`${this.apiUrl}/tags`);
  }

  deleteContact(id: string) {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
