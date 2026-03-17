import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ApiService, PageResponse } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [ApiService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'admin-ui';
  prompt = '';
  loading = false;
  generatedPage: PageResponse | null = null;
  clientUrl = 'http://localhost:4201/'; // Assuming client runs on 4201

  constructor(private apiService: ApiService) {}

  generateDesign() {
    if (!this.prompt.trim()) return;
    this.loading = true;
    this.generatedPage = null;

    this.apiService.generatePage(this.prompt).subscribe({
      next: (res) => {
        this.generatedPage = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error generating page', err);
        this.loading = false;
      }
    });
  }
}
