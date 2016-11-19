import {Component, OnInit} from '@angular/core';

import {TaxesCategory} from '../model/taxesCategory.model';
import {SpDataService} from '../sp-data/spdata.service';
import {Expense} from '../model/expense.model';
import * as _ from 'lodash';

// TODO valider ID d'imôt foncier...il y en a 2.

@Component({
  selector: 'app-impot',
  templateUrl: './impot.component.html',
  styleUrls: ['impot.component.less']
})
export class ImpotComponent implements OnInit {
  taxeCategories: TaxesCategory[];
  expenses: Expense[];
  selectedYear: number;
  availableYears: number[];
  percentageHousePersonalMerlin: number = 0.333333;
  percentageHousePersonalDenise: number = 0;
  totalExpenses: number = 0;
  totalExpensesPersonelMM: number = 0;
  totalExpensesPersonelDM: number = 0;

  constructor(private spDataService: SpDataService) {

  }

  ngOnInit() {

    this.selectedYear = new Date().getFullYear();
    this.availableYears = [];  // TODO : trouver une manière de faire ça plus élégant
    for (let i = 2010; i <= this.selectedYear; i++) {
      this.availableYears.push(i);
    }
    this.loadDataForYear(this.selectedYear);
    this.spDataService.getTaxCategories().subscribe(data => {
      this.taxeCategories = data;
      console.log(this.taxeCategories);
    });


    /*
     this.spDataService.getAllExpenses().subscribe(data => {
     // console.log(data);
     this.expenses = data;
     _.map(this.taxeCategories, (taxeCategory) => {
     taxeCategory.sum = this.getSumFromTaxId(data, taxeCategory.taxeCategory);
     });
     // console.log(this.taxeCategories);
     }, err => { console.log(err); });
     */

  }


  loadDataForYear(year) {
    this.selectedYear = year;
    this.spDataService.getAllExpenses(year).subscribe(data => {
      this.expenses = data;
      console.log(this.expenses);
      this.calculatedSumPerTaxCategory(this.expenses);
      this.calculateSums();
    });
  }
  private calculatedSumPerTaxCategory(expenses: Expense[]) {
    _.each(this.taxeCategories, (taxeCategory) => {
      if (taxeCategory.taxeCategory) { // Ensure it doesn't calculatated null items
        taxeCategory.sum = this.getSumFromTaxId(this.expenses, taxeCategory.taxeCategory);
        taxeCategory.percentagePersonalDM = this.percentageHousePersonalDenise;
        taxeCategory.sumPersonalDM = taxeCategory.sum * this.percentageHousePersonalDenise;
        taxeCategory.percentagePersonalMM = this.percentageHousePersonalMerlin;
        taxeCategory.sumPersonalMM = taxeCategory.sum * this.percentageHousePersonalMerlin;
      }
    });
    console.log(this.taxeCategories);
  }
  private getSumFromTaxId(expenses: Expense[], taxCategoryId: number) {
    let x = _(expenses)
      .filter((expense: Expense) => {
        return expense.taxCategoryId === taxCategoryId;
      })
      .reduce((sum, expense: Expense) => {
        return sum + expense.price;
      }, 0);
    return parseInt(x);
  }
  private calculateSums () {
    this.totalExpenses = _.reduce(this.taxeCategories, (sum: number, taxCategory) => {
      return sum + taxCategory.sum;
    }, 0);
    this.totalExpensesPersonelDM = _.reduce(this.taxeCategories, (sum: number, taxCategory) => {
      return sum + taxCategory.sumPersonalDM;
    }, 0);
    this.totalExpensesPersonelMM = _.reduce(this.taxeCategories, (sum: number, taxCategory) => {
      return sum + taxCategory.sumPersonalMM;
    }, 0);
  }
}
