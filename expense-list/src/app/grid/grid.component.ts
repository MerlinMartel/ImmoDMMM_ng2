import {Component, OnInit} from '@angular/core';

import pnp from 'sp-pnp-js';
import * as _ from 'lodash';
import {GridOptions} from 'ag-grid/main';
import {Expense} from './expense.model'

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  Expenses: [Expense] = [];
  depenseListItems:any;
  depenseListDocuments:any;
  private gridOptions: GridOptions;
  rowData;
  private columnDefs: any[];
  private rowCount: string;

  constructor() {
    this.gridOptions = <GridOptions>{};
    this.columnDefs = [
      {headerName: 'Action', template: '<div style="width: 100%" data-action-type="openItem">Ouvrir</div>', width: 80},
      {headerName: 'Id', field: 'Id', width: 50},
      {headerName: 'Prix', field: 'Prix', width: 50},
    ];

  }

  ngOnInit() {

    pnp.sp.web.lists.getByTitle('Depenses').items.get().then(res => {
      console.log(res);
      this.depenseListItems = res;
      _.map(this.depenseListItems, item => {
        let x = new Expense;
        x.price = item.Prix;
        x.validated = item.Valide;
        x.id = item.Id;
        x.created = item.Created;
        x.modified = item.Modified;
        x.authorId = item.AuthorId;
        x.providerId = item.ProviderId;
        x.title = item.Title;

        this.Expenses.push(x);
      });
      console.log(this.Expenses);
    });
    pnp.sp.web.lists.getByTitle('Dépenses').items.get().then(res => {
      console.log(res);
      this.depenseListDocuments = res;
    });


  }

  private calculateRowCount() {

    if (this.gridOptions.api && this.rowData) {
      var model = this.gridOptions.api.getModel();
      var totalRows = this.rowData.length;
      var processedRows = model.getRowCount();
      this.rowCount = processedRows.toLocaleString() + ' / ' + totalRows.toLocaleString();
    }
  }

  private setDefaultFilter() {
    /*    this.rowDataFiltered = _.filter(this.rowData, row => {
     return row.CSBJStatut != 'Complété';
     });*/
  }

  private onModelUpdated() {
    this.calculateRowCount();
  }

  private onReady() {
    this.calculateRowCount();
  }

  private onRowClicked($event) {
    // console.log('onRowClicked: ' + $event.node.data.name);
    if ($event.event.target !== undefined) {
      let data = $event.data;
      //TODO PB - let actionType = $event.event.target.getAttribute("data-action-type");
      return this.openItem(data);

      /*            switch (actionType) {
       case "openItem":
       return this.openItem(data);
       }*/
    }
  }

  public openItem(data: any) {
    // console.log("View action clicked", data);
    //this.router.navigate(['engagement', {currentID: data.notInModel.Id}]);
  }

  private onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }

}
