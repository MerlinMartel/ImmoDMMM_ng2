import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {GridComponent} from '../expenses-list/expenses-list.component';
import {ImpotComponent} from '../impot/impot.component';
import {ReimbursementComponent} from "../reimbursement/reimbursement.component";
import {ExpenseFormComponent} from "../expense-form/expense-form.component";


const appRoutes: Routes = [
  { path: 'taxes', component: ImpotComponent },
  { path: 'expenses', component: GridComponent },
  { path: 'reimbursement', component: ReimbursementComponent },
  { path: 'expense/:id', component: ExpenseFormComponent }
  ];

export const appRoutingProviders: any[] = [

];
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
