import { Component, OnInit, ElementRef, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ClientApiService, PageResponse } from '../services/client-api.service';

@Component({
  selector: 'app-page-renderer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col min-h-screen bg-gray-50">
      <div *ngIf="loading" class="flex-grow flex items-center justify-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
      
      <div *ngIf="error" class="flex-grow flex items-center justify-center text-red-600 font-medium">
        {{ error }}
      </div>

      <!-- Dynamic Content Wrapper -->
      <div class="flex-grow w-full relative">
        <div #dynamicContainer class="w-full h-full min-h-screen"></div>
      </div>

      <!-- Static Footer -->
      <footer *ngIf="pageData && !loading" class="bg-indigo-900 border-t border-indigo-800 shadow-lg fixed bottom-0 w-full z-50">
        <div class="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div class="text-indigo-100 flex items-center gap-3">
             <div class="bg-indigo-800 rounded-md p-2">
               <svg class="w-5 h-5 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
             </div>
             <div>
               <p class="text-sm font-semibold text-white">Fill out the form above</p>
               <p class="text-xs text-indigo-300">Your data will be securely saved</p>
             </div>
          </div>
          
          <button 
            (click)="saveData()" 
            [disabled]="saving"
            class="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg transform transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <span *ngIf="!saving">Save Submission</span>
            <span *ngIf="saving">Saving...</span>
            <svg *ngIf="!saving" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
          </button>
        </div>
      </footer>
    </div>
  `,
  encapsulation: ViewEncapsulation.None
})
export class PageRendererComponent implements OnInit, OnDestroy {
  @ViewChild('dynamicContainer', { static: false }) dynamicContainer!: ElementRef;
  
  loading = true;
  saving = false;
  error = '';
  pageData: PageResponse | null = null;
  private scriptEls: HTMLScriptElement[] = [];
  private styleEls: HTMLStyleElement[] = [];

  constructor(
    private route: ActivatedRoute,
    private apiService: ClientApiService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadPage(id);
      } else {
        this.error = 'No page ID specified.';
        this.loading = false;
      }
    });
  }

  ngOnDestroy() {
    this.cleanupDynamicAssets();
  }

  private loadPage(id: string) {
    this.loading = true;
    this.error = '';
    
    this.apiService.getPage(id).subscribe({
      next: (res) => {
        this.pageData = res;
        this.loading = false;
        setTimeout(() => this.injectDynamicContent(), 0);
      },
      error: (err) => {
        this.error = 'Failed to load page. It may not exist.';
        this.loading = false;
      }
    });
  }

  private injectDynamicContent() {
    if (!this.pageData || !this.dynamicContainer) return;
    
    // Cleanup previous dynamic assets
    this.cleanupDynamicAssets();

    // 1. Inject HTML
    this.dynamicContainer.nativeElement.innerHTML = this.pageData.html;

    // 2. Inject CSS
    if (this.pageData.css) {
      const styleEl = document.createElement('style');
      styleEl.innerHTML = this.pageData.css;
      document.head.appendChild(styleEl);
      this.styleEls.push(styleEl);
    }

    // 3. Inject JS
    if (this.pageData.js) {
      const scriptEl = document.createElement('script');
      scriptEl.innerHTML = this.pageData.js;
      document.body.appendChild(scriptEl);
      this.scriptEls.push(scriptEl);
    }
  }

  private cleanupDynamicAssets() {
    this.styleEls.forEach(el => el.remove());
    this.styleEls = [];
    this.scriptEls.forEach(el => el.remove());
    this.scriptEls = [];
  }

  saveData() {
    if (!this.pageData) return;
    
    this.saving = true;
    const formData: any = {};
    
    // Scrape data from all inputs in the dynamic container
    const inputs = this.dynamicContainer.nativeElement.querySelectorAll('input, select, textarea');
    inputs.forEach((input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) => {
      const name = input.name || input.id;
      if (name) {
        formData[name] = input.value;
      }
    });

    this.apiService.submitData(this.pageData.id, formData).subscribe({
      next: () => {
        alert('Data saved successfully!');
        this.saving = false;
        // Optionally clear the form
        inputs.forEach((input: any) => input.value = '');
      },
      error: () => {
        alert('Failed to save data. Check console.');
        this.saving = false;
      }
    });
  }
}
