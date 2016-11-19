import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {GridComponent} from '../grid/grid.component';
import {ImpotComponent} from '../impot/impot.component';


const appRoutes: Routes = [
  { path: 'taxes', component: ImpotComponent },
  { path: '', component: GridComponent }
  ];

export const appRoutingProviders: any[] = [

];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
