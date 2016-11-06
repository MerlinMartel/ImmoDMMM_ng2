import { ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';

import {GridComponent} from '../grid/grid.component';
import {ImpotComponent} from '../impot/impot.component';


const appRoutes = [
  { path: '', component: GridComponent },
  { path: '**', component: GridComponent },
  { path: 'expenses', component: GridComponent },
  { path: 'taxes', component: ImpotComponent }
];

export const appRoutingProviders: any[] = [

];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
