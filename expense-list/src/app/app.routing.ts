import {GridComponent} from './grid/grid.component';
import {ImpotComponent} from './impot/impot.component';

export const appRoutes = [
  { path: '', redirectTo: '/expenses', pathMatch: 'full'},
  { path: 'expenses', component: GridComponent },
  { path: 'taxes', component: ImpotComponent }
];
