import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import { AgGridModule } from 'ag-grid-ng2';
import { ImpotComponent } from './impot/impot.component';
import { routing, appRoutingProviders }  from './routing';
import { SpDataService } from './sp-data/spdata.service';

@NgModule({
  declarations: [
    AppComponent,
    GridComponent,
    ImpotComponent
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
