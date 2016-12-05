import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { GridComponent } from './expenses-list/expenses-list.component';
import { AgGridModule } from 'ag-grid-ng2';
import { AppComponent } from './app.component';
import {routing, appRoutingProviders} from "./routing/app.routing";
import {ImpotComponent} from "./impot/impot.component";
import {SpDataService} from "./sp-data/spdata.service";
import { ReimbursementComponent } from './reimbursement/reimbursement.component';
import { ExpenseFormComponent } from './expense-form/expense-form.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ImpotComponent,
    ReimbursementComponent,
    ExpenseFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgGridModule.withNg2ComponentSupport(),
    routing,
    ReactiveFormsModule
  ],
  providers: [
    SpDataService,
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
