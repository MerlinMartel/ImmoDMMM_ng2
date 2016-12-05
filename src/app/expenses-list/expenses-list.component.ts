import { Component, OnInit } from '@angular/core';
import { GridOptions } from 'ag-grid/main';
import { Expense } from '../model/expense.model';
import { SpDataService } from '../sp-data/spdata.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-grid',
  templateUrl: 'expenses-list.component.html',
  styleUrls: ['expenses-list.component.less'],
  providers: [SpDataService]
})
export class GridComponent implements OnInit {
  private rowData: Expense[];
  private gridOptions: GridOptions;
  private columnDefs: any[];
  private rowCount: string;
  selectedYear: number;
  availableYears: number[];
  inProgress: boolean = false;

  constructor(private spDataService: SpDataService, private router: Router) {
  }

  ngOnInit() {
    this.rowData = [];
    this.gridOptions = <GridOptions>{};
    this.columnDefs = [
      {
        headerName: 'Action', template: '<div style="width: 100%" data-action-type="openItem">Ouvrir</div>',
        width: 60
      },
      {headerName: 'Titre', field: 'title', width: 100},

      {headerName: 'Prix', field: 'price', width: 70},
      {
        headerName: 'Validé', field: 'validated', width: 50,
        cellClassRules: {
          'validated-true': 'x == true',
          'hidden': 'x != true'
        },
        template: '<i class="ms-Icon ms-Icon--SkypeCheck" aria-hidden="true"></i>'
      },
      {headerName: 'Gestionnaire', field: 'manager', width: 100},
      {headerName: 'Date', field: 'date', width: 100, sort: 'desc'},
      {headerName: 'Fournisseur', field: 'provider', width: 150},
      {headerName: 'Logement', field: 'flat', width: 100},
      {headerName: 'Catégorie de taxe', field: 'taxCategory', width: 150},
      {
        headerName: '',
        field: 'p',
        width: 50,
        template: '<i class="ms-Icon ms-Icon--Hide2" aria-hidden="true"></i>',
        cellClassRules: {
          'hidden': 'x != true'
        }
      }
    ];
    this.gridOptions.rowData = this.rowData;
    this.selectedYear = new Date().getFullYear();
    this.availableYears = [];  // TODO : trouver une manière de faire ça plus élégant
    for (let i = 2010; i <= this.selectedYear; i++) {
      this.availableYears.push(i);
    }
    this.loadDataForYear(this.selectedYear);

  };

  loadDataForYear(year) {
    this.inProgress = true;
    this.spDataService.getExpenses(year).subscribe(data => {
      this.rowData = data;
      this.inProgress = false;
    }, err => {
      console.log(err);
    });
  }

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
  }

  private onCellClicked(event) {
    console.log('onCellClicked: ');
    if (event.colDef.headerName == 'Action') {
      let data = event.data;
      return this.openItem(data);
    }
  }

  public openItem(data: any) {
    this.router.navigate(['/expense', data.id]);
    //window.location.href = data.relativeEditLink;
  }

  private onQuickFilterChanged($event) {
    this.gridOptions.api.setQuickFilter($event.target.value);
  }

  goToDocLib() {
    window.location.href = "/sites/immoDMMM/1821Bennett/Depenses/Forms/AllItems.aspx";
  }
}
