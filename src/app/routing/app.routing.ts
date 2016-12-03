import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {GridComponent} from '../grid/grid.component';
import {ImpotComponent} from '../impot/impot.component';
import {ReimbursementComponent} from "../reimbursement/reimbursement.component";


const appRoutes: Routes = [
  { path: 'taxes', component: ImpotComponent },
  { path: 'expenses', component: GridComponent },
  { path: 'reimbursement', component: ReimbursementComponent },
  { path: '**', redirectTo: 'expenses' } //TODO ceci fonctionne pas, la page reste vide...
  ];

export const appRoutingProviders: any[] = [

];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
