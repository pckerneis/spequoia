import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('../pages/document-page/document-page.component').then(
        (m) => m.DocumentPageComponent,
      ),
  },
  {
    path: 'example/:exampleId',
    loadComponent: () =>
      import('../pages/example-page/example-page.component').then(
        (m) => m.ExamplePageComponent,
      ),
  },
  {
    path: 'test-results/:exampleId',
    loadComponent: () =>
      import('../pages/test-results-page/test-results-page.component').then(
        (m) => m.TestResultsPageComponent,
      ),
  },
];
