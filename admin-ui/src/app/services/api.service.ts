import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PageResponse {
  id: string;
  description: string;
  html: string;
  css: string;
  js: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://localhost:8080/api/pages';

  constructor(private http: HttpClient) {}

  generatePage(description: string): Observable<PageResponse> {
    return this.http.post<PageResponse>(`${this.baseUrl}/generate`, { description });
  }
}
