import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { GridComponent } from './grid/grid.component';
import { AgGridModule } from 'ag-grid-angular';
import { AppComponent } from './app.component';
import { routing, appRoutingProviders } from './routing/app.routing';
import { ImpotComponent } from './impot/impot.component';
import { SpDataService } from './sp-data/spdata.service';
import { ReimbursementComponent } from './reimbursement/reimbursement.component';
import {Router, RouterModule} from '@angular/router';
import { TestgridComponent } from './testgrid/testgrid.component';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ImpotComponent,
    ReimbursementComponent,
    TestgridComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AgGridModule.withComponents(
      []
    ),
    routing
  ],
  providers: [
    SpDataService,
    appRoutingProviders
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
