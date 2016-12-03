import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { GridComponent } from './grid/grid.component';
import { AgGridModule } from 'ag-grid-ng2';
import { AppComponent } from './app.component';
import {routing, appRoutingProviders} from "./routing/app.routing";
import {ImpotComponent} from "./impot/impot.component";
import {SpDataService} from "./sp-data/spdata.service";
import { ReimbursementComponent } from './reimbursement/reimbursement.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ImpotComponent,
    ReimbursementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgGridModule.withNg2ComponentSupport(),
    routing
  ],
  providers: [
    SpDataService,
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
