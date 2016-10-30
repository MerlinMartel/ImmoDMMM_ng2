import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';
import {AgGridModule} from "ag-grid-ng2";
import { ImpotComponent } from './impot/impot.component';

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
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
