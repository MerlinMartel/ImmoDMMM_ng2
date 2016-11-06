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
  getAllExpenses(): Observable {

    var that = this;
    console.log('SpDataService.getAllExpenses');
    let getAllExObservable =  new Observable(observer => {

      let batch = pnp.sp.createBatch();
      pnp.sp.web.lists.getByTitle('Depenses').items.top(10000).inBatch(batch).get().then(res => {
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
          x.providerId = item.FournisseursId;
          x.title = item.Title;
          x.manager = item.GestionnairesChoice;
          x.relativeEditLink = _spPageContextInfo.webAbsoluteUrl + '/Depenses/Forms/EditForm.aspx?ID=' + item.Id + '&Source=' + window.location.href;
          if (x.date != undefined) {
            x.year = parseInt(x.date.substr(0, 4));
          }
          if (item.Logements) {
            x.flatId = item.Logements.Label;
          }
          if (item.TaxesCategory) {
            x.taxCategoryId = item.TaxesCategory.Label;
          }
          that.expenses.push(x);
        });
      });
      pnp.sp.web.lists.getByTitle('D%C3%A9penses').items.top(10000).inBatch(batch).get().then(res => {
        _.map(res, item => {
          let x = new Expense;
          x.type = 'item';
          x.price = item.Montant;
          x.validated = item.Valid_x00e9_;
          x.id = item.Id;
          x.created = item.Created;
          x.modified = item.Modified;
          x.date = item.Date;
          x.authorId = item.AuthorId;
          x.providerId = item.FournisseursId;
          x.title = item.Title;
          x.manager = item.GestionnairesChoice;
          x.relativeEditLink = _spPageContextInfo.webAbsoluteUrl + '/Lists/depenses/EditForm.aspx?ID=' + item.Id + '&Source=' + window.location.href;
          if (x.date != undefined) {
            x.year = parseInt(x.date.substr(0, 4));
          }
          if (item.Logements) {
            x.flatId = item.Logements.Label;
          }
          if (item.TaxesCategory) {
            x.taxCategoryId = item.TaxesCategory.Label;
          }
          that.expenses.push(x);

        });
      });
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
        console.log(that.taxonomyHiddenList);
        _.map(that.expenses, (expenseItem) => {
          console.log('process taxo 1');
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
