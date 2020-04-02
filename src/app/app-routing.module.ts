import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
        import('./pages/home/home.module').then(m => m.HomePageModule),
  },
  {
    path: 'game/:id',
    loadChildren: () =>
        import('./pages/game/game.module').then(m => m.GamePageModule),
  },
  {
    path: 'all',
    loadChildren: () => import('./pages/all/all.module').then( m => m.AllPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules}),
  ],
  exports: [
    RouterModule,
  ]
})
export class AppRoutingModule {
}
