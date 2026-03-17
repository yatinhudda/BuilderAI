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
export class ClientApiService {
  private baseUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getPage(id: string): Observable<PageResponse> {
    return this.http.get<PageResponse>(`${this.baseUrl}/pages/${id}`);
  }

  submitData(pageId: string, formData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/submissions`, { pageId, formData });
  }
}
