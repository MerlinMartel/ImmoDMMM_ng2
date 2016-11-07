import {Injectable} from '@angular/core';

import pnp from 'sp-pnp-js';
import * as _ from 'lodash';
import {Expense} from '../model/expense.model';
import {Provider} from '../model/provider.model';
import {TaxonomyHiddenList} from '../model/taxonomyHiddenList.model';
import {Observable} from 'rxjs';

@Injectable()
export class SpDataService {
  expenses: [Expense] = [];
  providers: [Provider] = [];
  taxonomyHiddenList: [TaxonomyHiddenList] = [];

  constructor() {
  }
  getAllExpenses(year?: number): Observable {
    this.expenses = []; //Reset Array, because of the push...it was accumulating
    var that = this;
    console.log('SpDataService.getAllExpenses');
    let getAllExObservable =  new Observable(observer => {


      let batch = pnp.sp.createBatch();
      if (year !== undefined) {
        console.log('year is defined');
        let dateFilterStringForSpecificYearDoc = "Date1 gt '" + year + "-01-01T00:00:00Z' and Date1 lt '" + year + "-12-31T00:00:00Z'";
        let dateFilterStringForSpecificYearItem = "Date gt '" + year + "-01-01T00:00:00Z' and Date lt '" + year + "-12-31T00:00:00Z'";
        pnp.sp.web.lists.getByTitle('Depenses').items.filter(dateFilterStringForSpecificYearDoc).top(5000).inBatch(batch).get().then(res => {
          this.createObjectForDepensesDoc(res);
        });
        pnp.sp.web.lists.getByTitle('D%C3%A9penses').items.filter(dateFilterStringForSpecificYearItem).top(5000).inBatch(batch).get().then(res => {
          this.createObjectForDepensesItem(res);
        });
      } else {
        console.log('year is NOT defined');
        pnp.sp.web.lists.getByTitle('Depenses').items.top(5000).inBatch(batch).get().then(res => {
          this.createObjectForDepensesDoc(res);
        });
        pnp.sp.web.lists.getByTitle('D%C3%A9penses').items.top(5000).inBatch(batch).get().then(res => {
          this.createObjectForDepensesItem(res);
        });
      }
      pnp.sp.site.rootWeb.lists.getByTitle('Fournisseurs').items.top(5000).inBatch(batch).get().then(res => {
        _.map(res, item => {
          let x = new Provider;
          x.id = item.Id;
          x.title = item.Title;
          that.providers.push(x);
        });
      });
      pnp.sp.site.rootWeb.lists.getByTitle('TaxonomyHiddenList').items.top(5000).get().then(res => {
        _.map(res, item => {
          let x = new TaxonomyHiddenList;
          x.id = item.Id;
          x.path1033 = item.Path1033;
          x.path1036 = item.Path1036;
          x.term1033 = item.Term1033;
          x.term1036 = item.Term1036;
          that.taxonomyHiddenList.push(x);
        });
      });
      batch.execute().then(() => {
        console.log('everything is loaded !!!');
        _.map(that.expenses, (expenseItem) => {
          let taxoItemFiltered = _.filter(that.taxonomyHiddenList, (taxoItem) => {
            return taxoItem.id == expenseItem.flatId;
          });
          if (taxoItemFiltered.length > 0) {
            expenseItem.flat = taxoItemFiltered[0].term1036;
          }
        });
        _.map(that.expenses, (expenseItem) => {
          let taxoItemFiltered = _.filter(that.taxonomyHiddenList, (taxoItem) => {
            return taxoItem.id == expenseItem.taxCategoryId;
          });
          if (taxoItemFiltered.length > 0) {
            expenseItem.taxCategory = taxoItemFiltered[0].term1036;
          }
        });
        _.map(that.expenses, (expenseItem) => {
          let providerItemFiltered = _.filter(that.providers, (providerItem) => {
            return providerItem.id == expenseItem.providerId;
          });
          if (providerItemFiltered.length > 0) {
            expenseItem.provider = providerItemFiltered[0].title;
          }
        });
        observer.next(that.expenses);
        observer.complete();
      });

    });
    return getAllExObservable;
  }

  getProviders() {

  }
  createObjectForDepensesDoc(res) {
    _.map(res, item => {
      let x = new Expense;
      x.type = 'Document';
      x.price = item.Prix;
      x.validated = item.Valide;
      x.id = item.Id;
      x.created = item.Created;
      x.modified = item.Modified;
      x.date = item.Date1;
      x.authorId = item.AuthorId;
      x.providerId = parseInt(item.FournisseursId);
      x.title = item.Title;
      x.manager = item.GestionnairesChoice;
      x.relativeEditLink = _spPageContextInfo.webAbsoluteUrl + '/Depenses/Forms/EditForm.aspx?ID=' + item.Id + '&Source=' + window.location.href;
      if (x.date != undefined) {
        x.year = parseInt(x.date.substr(0, 4));
      }
      if (item.Logements) {
        x.flatId = parseInt(item.Logements.Label);
      }
      if (item.TaxesCategory) {
        x.taxCategoryId = parseInt(item.TaxesCategory.Label);
      }
      this.expenses.push(x);
    });
  }
  createObjectForDepensesItem(res) {
    _.map(res, item => {
      let x = new Expense;
      x.type = 'item';
      x.price = item.Montant;
      x.validated = item.Valid_x00e9_;
      x.id = item.Id;
      x.created = item.Created;
      x.modified = item.Modified;
      x.date = item.Date;
      x.authorId = parseInt(item.AuthorId);
      x.providerId = item.FournisseursId;
      x.title = item.Title;
      x.manager = item.GestionnairesChoice;
      x.relativeEditLink = _spPageContextInfo.webAbsoluteUrl + '/Lists/depenses/EditForm.aspx?ID=' + item.Id + '&Source=' + window.location.href;
      if (x.date != undefined) {
        x.year = parseInt(x.date.substr(0, 4));
      }
      if (item.Logements) {
        x.flatId = parseInt(item.Logements.Label);
      }
      if (item.TaxesCategory) {
        x.taxCategoryId = parseInt(item.TaxesCategory.Label);
      }
      this.expenses.push(x);

    });
  }
  getTaxonomyHiddenList() {
    return new Promise((resolve, reject) => {
      var taxonomyHiddenList: [TaxonomyHiddenList];
      pnp.sp.site.rootWeb.lists.getByTitle('TaxonomyHiddenList').items.top(5000).get().then(res => {
        _.map(res, item => {
          let x = new TaxonomyHiddenList;
          x.id = item.Id;
          x.path1033 = item.Path1033;
          x.path1036 = item.Path1036;
          x.term1033 = item.Term1033;
          x.term1036 = item.Term1036;
          taxonomyHiddenList.push(x);
        });
        return taxonomyHiddenList;
      });
    });

  }
}
