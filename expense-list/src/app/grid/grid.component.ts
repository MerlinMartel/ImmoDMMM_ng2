import {Component, OnInit} from '@angular/core';

import pnp from 'sp-pnp-js';
import * as _ from 'lodash';
import {GridOptions} from 'ag-grid/main';
import {Expense} from './expense.model'
import {Provider} from "./provider.model";
import {TaxonomyHiddenList} from "./taxonomyHiddenList.model";

@Component({
  selector: 'app-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent implements OnInit {
  expenses: [Expense] = [];
  rowData: [Expense] = [];
  providers : [Provider] = [];
  taxonomyHiddenList : [TaxonomyHiddenList] = [];
  depenseListItems: any;
  depenseListDocuments: any;
  private gridOptions: GridOptions;
  private columnDefs: any[];
  private rowCount: string;

  constructor() {
    this.gridOptions = <GridOptions>{};
    this.columnDefs = [
      {headerName: 'Action', template: '<div style="width: 100%" data-action-type="openItem">Ouvrir</div>', width: 80},
      {headerName: 'Id', field: 'id', width: 50},
      {headerName: 'Prix', field: 'price', width: 100},
      {headerName: 'Validé', field: 'validated', width: 100},
      {headerName: 'Gestionnaire', field: 'manager', width: 100},
      {headerName: 'Date', field: 'date', width: 100},
      {headerName: 'Année', field: 'year', width: 100},
      {headerName: 'Fournisseur', field: 'providerId', width: 100},
      {headerName: 'Logement', field: 'flat', width: 100},
      {headerName: 'Catégorie de taxe', field: 'taxCategory', width: 100},
    ];

  }

  ngOnInit() {
    let batch = pnp.sp.createBatch();
    this.gridOptions.rowData = this.rowData;
    pnp.sp.web.lists.getByTitle('Depenses').items.top(10000).inBatch(batch).get().then(res => {
      console.log('Documents');
      this.depenseListItems = res;
      _.map(this.depenseListItems, item => {
        let x = new Expense;
        x.price = item.Prix;
        x.validated = item.Valide;
        x.id = item.Id;
        x.created = item.Created;
        x.modified = item.Modified;
        x.date = item.Date1;
        //x.year = item.Date.getFullYear();
        x.authorId = item.AuthorId;
        x.providerId = item.FournisseursId;
        x.title = item.Title;
        if (item.odata) {
          x.relativeEditLink = item.odata.editLink;
        }
        x.manager = item.GestionnairesChoice;
        if (item.Logements) {
          x.flat = item.Logements.Label;
        }
        if (item.TaxesCategory) {
          x.taxCategory = item.TaxesCategory.Label;
        }


        this.expenses.push(x);
      });

      if (this.rowData.length > 1) {
        this.rowData.concat(this.expenses);
      } else {
        this.rowData = this.expenses
      }


      console.log('this.Expenses');
      console.log(this.expenses);
    });
    pnp.sp.web.lists.getByTitle('Dépenses').items.top(10000).inBatch(batch).get().then(res => {
      console.log('Lists');
      this.depenseListDocuments = res;

      _.map(this.depenseListDocuments, item => {
        let x = new Expense;
        x.price = item.Montant;
        x.validated = item.Valid_x00e9_;
        x.id = item.Id;
        x.created = item.Created;
        x.modified = item.Modified;
        x.date = item.Date;
        //x.year = date.getYear();
        x.authorId = item.AuthorId;
        x.providerId = item.FournisseursId;
        x.title = item.Title;
        if (item.odata) {
          x.relativeEditLink = item.odata.editLink;
        }
        x.manager = item.GestionnairesChoice;

        if (item.Logements) {
          x.flat = item.Logements.Label;
        }
        if (item.TaxesCategory) {
          x.taxCategory = item.TaxesCategory.Label;
        }


        this.expenses.push(x);

      });
      if (this.rowData.length > 1) {
        this.rowData.concat(this.expenses);
      } else {
        this.rowData = this.expenses
      }
      console.log(this.expenses);

    });
    pnp.sp.site.rootWeb.lists.getByTitle('Fournisseurs').items.top(5000).inBatch(batch).get().then(res => {
      _.map(res, item => {
        let x = new Provider;
        x.id = item.Id;
        x.title = item.Title;
        this.providers.push(x);
      });
    console.log(this.providers)
    });
    pnp.sp.site.rootWeb.lists.getByTitle('TaxonomyHiddenList').items.top(5000).inBatch(batch).get().then(res => {
      console.log(res);
      _.map(res, item => {
        let x = new TaxonomyHiddenList;
        x.id = item.Id;
        x.path1033 = item.Path1033;
        x.path1036 = item.Path1036;
        x.term1033 = item.Term1033;
        x.term1036 = item.Term1036;
        this.taxonomyHiddenList.push(x);
      });
    })
    batch.execute().then(function() {

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
