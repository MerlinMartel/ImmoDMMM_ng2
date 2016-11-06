import {Component, OnInit} from '@angular/core';

import {TaxesCategory} from '../model/taxesCategory.model';
import {SpDataService} from '../sp-data/spdata.service';
import {Expense} from '../model/expense.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-impot',
  templateUrl: './impot.component.html',
  styleUrls: ['impot.component.less']
})
export class ImpotComponent implements OnInit {
  taxesCategory: [TaxesCategory];
  expenses: [Expense];
  test: any;
  test2: any;
  test3: any;

  constructor(private spDataService: SpDataService) {
  }

  ngOnInit() {
    this.taxesCategory = [
      {
        title: 'Publicité',
        number: 8521
      },
      {
        title: 'Assurances',
        number: 8690,
        taxeCategory: 18
      },
      {
        title: 'Intérêts',
        number: 8710
      },
      {
        title: 'Frais de bureau',
        number: 8810
      },
      {
        title: 'Frais comptables, juridiques et autres honoraires',
        number: 8860,
        taxeCategory: 30
      },
      {
        title: "Frais de gestion et d'administration",
        number: 8871,
        taxeCategory: 37
      },
      {
        title: 'Entretien et réparation',
        number: 8871,
        taxeCategory: 21
      },
      {
        title: 'Salaires, traitements et avantages',
        number: 9060,
        taxeCategory: 38
      },
    ];
    this.spDataService.getAllExpenses().subscribe(data => {
      console.log(data);
      this.expenses = data;
      _.map(this.taxesCategory, (taxeCategory) => {
        taxeCategory.sum = this.getPriceSumFromExpenses(data, taxeCategory.taxeCategory);
      });
      console.log(this.taxesCategory);
    }, err => { console.log(err); });

  }
  getPriceSumFromExpenses(expenses: [Expense], taxCategoryId: number) {
    return _(expenses)
      .filter((expense: Expense) => { return expense.taxCategoryId == taxCategoryId; })
      .reduce((sum, expense: Expense) => {
        return sum + expense.price;
      }, 0);
  }
}
