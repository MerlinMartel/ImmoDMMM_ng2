import {Component, OnInit} from '@angular/core';

import {GridOptions} from 'ag-grid/main';
import {Expense} from '../model/expense.model';
import {SpDataService} from '../sp-data/spdata.service';

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css'],
  providers: [SpDataService]
})
export class GridComponent implements OnInit {
  rowData: [Expense] = [];
  private gridOptions: GridOptions;
  private columnDefs: any[];
  private rowCount: string;
  constructor(private spDataService: SpDataService) {

  }


  /*
        cellRenderer : function(params) {
   console.log(params);
   }
  * */

  ngOnInit() {
    this.gridOptions = <GridOptions>{};
    this.columnDefs = [
      { headerName: 'Action', template: 'Ouvrir',
        width: 80},
      {headerName: 'Titre', field: 'title', width: 100},
      {headerName: 'Type', field: 'type', width: 70},
      {headerName: 'Prix', field: 'price', width: 100},
      {
        headerName: 'Validé', field: 'validated', width: 90,
        cellClassRules: {
          'validated-true': 'x == true',
          'validated-false': 'x != true'
        }
      },
      {headerName: 'Gestionnaire', field: 'manager', width: 100},
      {headerName: 'Date', field: 'date', width: 100, sort: 'desc'},
      {headerName: 'Année', field: 'year', width: 100},
      {headerName: 'Fournisseur', field: 'provider', width: 100},
      {headerName: 'Logement', field: 'flat', width: 100},
      {headerName: 'Catégorie de taxe', field: 'taxCategory', width: 100},
    ];
    this.gridOptions.rowData = this.rowData;
    this.spDataService.getAllExpenses().subscribe(data => {
      this.rowData = data;
    }, err => { console.log(err); });
  };

  private onFilterChanged($event) {
    console.log('onFilterChanged');
    this.gridOptions.api.setQuickFilter($event.target.value);
  }
  private calculateRowCount() {

    if (this.gridOptions.api && this.rowData) {
      let model = this.gridOptions.api.getModel();
      let totalRows = this.rowData.length;
      let processedRows = model.getRowCount();
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
    console.log('onRowClicked: ');
    console.log($event);
    if ($event.event.target !== undefined) {
      let data = $event.data;
      // TODO PB - let actionType = $event.event.target.getAttribute("data-action-type");
      return this.openItem(data);

      /*            switch (actionType) {
       case "openItem":
       return this.openItem(data);
       }*/
    }
  }
  private onCellClicked($event) {
    console.log('onCellClicked: ');
  }
  public openItem(data: any) {
    window.location.href = data.relativeEditLink;
  }
  private onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }
}
