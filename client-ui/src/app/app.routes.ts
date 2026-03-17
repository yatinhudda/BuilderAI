import { Routes } from '@angular/router';
import { PageRendererComponent } from './page-renderer/page-renderer.component';

export const routes: Routes = [
  { path: ':id', component: PageRendererComponent },
  { path: '', redirectTo: '/', pathMatch: 'full' }
];
