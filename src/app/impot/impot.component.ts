import {Component, OnInit} from '@angular/core';

import {TaxesCategory} from '../model/taxesCategory.model';
import {SpDataService} from '../sp-data/spdata.service';
import {Expense} from '../model/expense.model';
import * as _ from 'lodash';
import goToHistoryLink = Nav.goToHistoryLink;
import {Revenu} from "../model/revenu.model";
import {Transaction} from "../model/transaction.model";

// TODO valider ID d'imôt foncier...il y en a 2.
// TODO peut avoir problème de load timing... mettre en place un forkJoin.

@Component({
  selector: 'app-impot',
  templateUrl: './impot.component.html',
  styleUrls: ['impot.component.less']
})
export class ImpotComponent implements OnInit {
  taxeCategories: TaxesCategory[];
  expenses: Expense[];
  revenues: Revenu[];
  selectedYear: number;
  availableYears: number[];
  percentageHousePersonalMerlin: number = 0.333333;
  percentageHousePersonalDenise: number = 0;
  totalExpenses: number = 0;
  totalExpensesPersonelMM: number = 0;
  totalExpensesPersonelDM: number = 0;
  totalExpensesWithOutPersonelMM: number = 0;
  totalExpensesWithOutPersonelDM: number = 0;
  enpenseWithoutFlat: boolean = false;
  totalRevenu: number;
  totalRevenuWithout1821: number;
  inProgress: boolean = false;
  interest: number;

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
     this.spDataService.getExpenses().subscribe(data => {
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
    this.inProgress = true;
    this.selectedYear = year;
    this.spDataService.getExpenses(year).subscribe(data => {
      this.expenses = data;
      console.log(this.expenses);
      this.calculatedSumPerTaxCategory(this.expenses);
      this.calculateSums();
      this.inProgress = false;
    });
    this.spDataService.getRevenues(year).subscribe(data => {
      this.revenues = data;
      this.totalRevenu = _.reduce(this.revenues, (sum, revenu: Revenu) => {
        return sum + revenu.r1821 + revenu.r1823 + revenu.r1825;
      }, 0);
      this.totalRevenuWithout1821 = _.reduce(this.revenues, (sum, revenu: Revenu) => {
        return sum + revenu.r1823 + revenu.r1825;
      }, 0);
    });
    this.spDataService.getTransactionCompte(year).subscribe(data => {
      this.interest = _(data)
        .filter((transaction: Transaction) => {
          return transaction.accountType.indexOf('PR') != -1;
        })
        .reduce((sum, transaction: Transaction) => {
          return sum + transaction.interest;
        }, 0);
      console.log('interest : ' + this.interest);
    });
  }

  private calculatedSumPerTaxCategory(expenses: Expense[]) {
    _.each(this.taxeCategories, (taxeCategory) => {
      if (taxeCategory.taxeCategory) { // Ensure it doesn't calculated null items
        taxeCategory.sum = this.getSumFromTaxId(this.expenses, taxeCategory.taxeCategory);
        taxeCategory.percentagePersonalDM = this.getPersonalSumFromTaxId(this.expenses, taxeCategory.taxeCategory, this.percentageHousePersonalDenise)[0];
        taxeCategory.sumPersonalDM = this.getPersonalSumFromTaxId(this.expenses, taxeCategory.taxeCategory, this.percentageHousePersonalDenise)[1];
        taxeCategory.percentagePersonalMM = this.getPersonalSumFromTaxId(this.expenses, taxeCategory.taxeCategory, this.percentageHousePersonalMerlin)[0];
        taxeCategory.sumPersonalMM = this.getPersonalSumFromTaxId(this.expenses, taxeCategory.taxeCategory, this.percentageHousePersonalMerlin)[1];
      }
      if (taxeCategory.number === 8710) { // AKA Interest
        taxeCategory.sum = this.interest;
        taxeCategory.percentagePersonalDM = this.percentageHousePersonalDenise;
        taxeCategory.sumPersonalDM = this.interest * this.percentageHousePersonalDenise;
        taxeCategory.percentagePersonalMM = this.percentageHousePersonalMerlin;
        taxeCategory.sumPersonalMM = this.interest * this.percentageHousePersonalMerlin;
      }
    });
    console.log(this.taxeCategories);
  }

  private getSumFromTaxId(expenses: Expense[], taxCategoryId: number) {
    return _(expenses)
      .filter((expense: Expense) => {
        return expense.taxCategoryId === taxCategoryId;
      })
      .reduce((sum, expense: Expense) => {
        return sum + expense.price;
      }, 0);
  }

  private getPersonalSumFromTaxId(expenses: Expense[], taxCategoryId: number, percentage) {
    let expensesInCategory = _(expenses)
      .filter((expense: Expense) => {
        return expense.taxCategoryId === taxCategoryId;
      })
      .value();
    if (percentage !== 0) {
      // AKA, Merlin qui a 33% en perso
      if (taxCategoryId === 21) {
        // AKA entretien et réparation
        /*
         1e Étage = FlatID 15
         2e Étage = FlatID 12
         3e Étage = FlatID 13
         Global = FlatID 14
         */
        let expense1e = _(expensesInCategory)
          .filter((expense: Expense) => {
            return expense.flatId === 15;
          })
          .reduce((sum, expense: Expense) => {
            return sum + expense.price;
          }, 0);
        let expense2e = _(expensesInCategory)
          .filter((expense: Expense) => {
            return expense.flatId === 12;
          })
          .reduce((sum, expense: Expense) => {
            return sum + expense.price;
          }, 0);
        let expense3e = _(expensesInCategory)
          .filter((expense: Expense) => {
            return expense.flatId === 13;
          })
          .reduce((sum, expense: Expense) => {
            return sum + expense.price;
          }, 0);
        let expenseGlobal = _(expensesInCategory)
          .filter((expense: Expense) => {
            return expense.flatId === 14;
          })
          .reduce((sum, expense: Expense) => {
            return sum + expense.price;
          }, 0);
        let expenseWithOutFlat = _(expensesInCategory)
          .filter((expense: Expense) => {
            return !expense.flatId;
          })
          .value();
        if (expenseWithOutFlat.length > 0) {
          this.enpenseWithoutFlat = true;
        } else {
          this.enpenseWithoutFlat = false;
        }

        return [(expense1e + (expenseGlobal * this.percentageHousePersonalMerlin)) / (expense1e + expense2e + expense3e + expenseGlobal), expense1e + (expenseGlobal * this.percentageHousePersonalMerlin)];
      } else {
        // tous les autres cat impôt.
        let x = _(expensesInCategory)
          .reduce((sum, expense: Expense) => {
            return sum + expense.price;
          }, 0);
        return [percentage, x * percentage];
      }
    } else {
      // AKA, denise, qui a 0 % perso
      return [0, 0]; // TODO, faire le vrai calcul !
    }
  }

  private calculateSums() {
    this.totalExpenses = _.reduce(this.taxeCategories, (sum: number, taxCategory) => {
      return sum + taxCategory.sum;
    }, 0);
    this.totalExpensesPersonelDM = _.reduce(this.taxeCategories, (sum: number, taxCategory) => {
      return sum + taxCategory.sumPersonalDM;
    }, 0);


    this.totalExpensesPersonelMM = _.reduce(this.taxeCategories, (sum: number, taxCategory) => {
      return sum + taxCategory.sumPersonalMM;
    }, 0);
    this.totalExpensesWithOutPersonelDM = this.totalExpenses - this.totalExpensesPersonelDM;
    this.totalExpensesWithOutPersonelMM = this.totalExpenses - this.totalExpensesPersonelMM;
  }
}
