import {Component, OnInit} from '@angular/core';
import {GridOptions} from 'ag-grid';
import {Expense} from '../model/expense.model';
import {SpDataService} from '../sp-data/spdata.service';

declare var _spPageContextInfo: any;

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['grid.component.less'],
  providers: [SpDataService]
})
export class GridComponent implements OnInit {
  private rowData: Expense[];
  public gridOptions: GridOptions;
  selectedYear: number;
  availableYears: number[];
  inProgress = false;

  constructor(private spDataService: SpDataService) {
    console.log('grid - constructor');

    this.rowData = [];
    this.gridOptions = {};
    this.gridOptions.columnDefs = [
      { headerName: 'Action', template: '<div style="width: 100%" data-action-type="openItem">Ouvrir</div>',
        width: 60},
      {headerName: 'Titre', field: 'title', width: 100},

      {headerName: 'Prix', field: 'price', width: 70},
      {
        headerName: 'Validé', field: 'validated', width: 50,
        cellClassRules: {
          'validated-true': 'x == true',
          'validated-false': 'x != true'
        }
      },
      {headerName: 'Gestionnaire', field: 'manager', width: 100},
      {headerName: 'Date', field: 'date', width: 100, sort: 'desc'},
      {headerName: 'Fournisseur', field: 'provider', width: 150},
      {headerName: 'Logement', field: 'flat', width: 100},
      {headerName: 'Catégorie de taxe', field: 'taxCategory', width: 150}
    ];
    // this.gridOptions.rowData = this.rowData;
    this.selectedYear = new Date().getFullYear();
    this.availableYears = [];  // TODO : trouver une manière de faire ça plus élégant
    for (let i = 2010; i <= this.selectedYear; i++) {
      this.availableYears.push(i);
    }
    this.loadDataForYear(this.selectedYear);

  }
  ngOnInit() {
  };
  loadDataForYear(year) {
    console.log('grid - loadDataForYear');
    this.inProgress = true;
    this.spDataService.getExpenses(year).subscribe(data => {
      this.rowData = data;
      console.log(this.rowData);
      this.inProgress = false;
    }, err => { console.log(err); });
  }
  goToDocLib() {
    window.location.href = '/sites/immoDMMM/1821Bennett/Depenses/Forms/AllItems.aspx';
  }
  private onCellClicked(event) {
    console.log('onCellClicked: ');
    if (event.colDef.headerName == 'Action') {
      let data = event.data;
      return this.openItem(data);
    }
  }
  public openItem(data: any) {
    window.location.href = data.relativeEditLink;
  }
}
