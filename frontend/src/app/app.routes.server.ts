import { RenderMode, ServerRoute } from '@angular/ssr';
import { routes as appRoutes } from './app.routes';

export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
