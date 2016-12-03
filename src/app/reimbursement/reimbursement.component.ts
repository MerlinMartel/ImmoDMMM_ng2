import {Component, OnInit} from '@angular/core';
import {SpDataService} from '../sp-data/spdata.service';
import {DisplayReimbursement} from '../model/displayReimbursement.model';
import {Reimbursement} from '../model/reimbursement.model';
import {Expense} from '../model/expense.model';
import {Observable} from "rxjs";

@Component({
  selector: 'app-reimbursement',
  templateUrl: './reimbursement.component.html',
  styleUrls: ['./reimbursement.component.css']
})
export class ReimbursementComponent implements OnInit {
  availableYears: number[];
  displayReimbursements: DisplayReimbursement[] = [];
  reimbursements: Reimbursement[] = [];
  expenses: Expense[] = [];
  remboursementDM: number = 0;
  remboursementMM: number = 0;
  inProgress: boolean;


  constructor(private spDataService: SpDataService) {
  }

  ngOnInit() {
    this.inProgress = true;
    let currentYear = new Date().getFullYear();
    this.availableYears = [];  // TODO : trouver une manière de faire ça plus élégant
    for (let i = 2010; i <= currentYear; i++) {
      this.availableYears.push(i);
    }
    let obsReimbursement = this.spDataService.getReimbursement();
    let obsExpenses = this.spDataService.getExpenses();
    Observable.forkJoin([obsReimbursement, obsExpenses]).subscribe(data => {
      //console.log(data);
      this.reimbursements = data[0];
      this.expenses = data[1];
      _.each(this.availableYears, item => {
        let displayReimbursement = new DisplayReimbursement;
        displayReimbursement.year = item;
        displayReimbursement.reimbursementMM = _(this.reimbursements)
          .filter((reimbursement: Reimbursement) => {
            return reimbursement.year === item && reimbursement.manager === 'Merlin Martel';
          })
          .reduce((sum, reimbursement: Reimbursement) => {
            return sum + reimbursement.amount;
          }, 0);
        displayReimbursement.reimbursementDM = _(this.reimbursements)
          .filter((reimbursement: Reimbursement) => {
            return reimbursement.year === item && reimbursement.manager === 'Denise Martel';
          })
          .reduce((sum, reimbursement: Reimbursement) => {
            return sum + reimbursement.amount;
          }, 0);
        displayReimbursement.expenseMM = _(this.expenses)
          .filter((expense: Expense) => {
            return expense.year === item && expense.manager === 'Merlin Martel' && expense.p == false;
          })
          .reduce((sum, expense: Expense) => {
            return sum + expense.price;
          }, 0);
        displayReimbursement.expenseDM = _(this.expenses)
          .filter((expense: Expense) => {
            return expense.year === item && expense.manager === 'Denise Martel' && expense.p == false;
          })
          .reduce((sum, expense: Expense) => {
            return sum + expense.price;
          }, 0);
        displayReimbursement.subTotalMM = displayReimbursement.expenseMM - displayReimbursement.reimbursementMM;
        displayReimbursement.subTotalDM = displayReimbursement.expenseDM - displayReimbursement.reimbursementDM;
        this.displayReimbursements.push(displayReimbursement);
      });
      //console.log(this.displayReimbursements);


      let depenseMerlin = _(this.expenses)
        .filter((expense: Expense) => {
          return expense.manager === 'Merlin Martel' && expense.p == false;
        })
        .reduce((sum, expense: Expense) => {
          return sum + expense.price;
        }, 0);
      let depenseDenise = _(this.expenses)
        .filter((expense: Expense) => {
          return expense.manager === 'Denise Martel' && expense.p == false;
        })
        .reduce((sum, expense: Expense) => {
          return sum + expense.price;
        }, 0);
      let reimbursementMerlin = _(this.reimbursements)
        .filter((reimbursement: Reimbursement) => {
          return reimbursement.manager === 'Merlin Martel';
        })
        .reduce((sum, reimbursement: Reimbursement) => {
          return sum + reimbursement.amount;
        }, 0);
      let reimbursementDenise = _(this.reimbursements)
        .filter((reimbursement: Reimbursement) => {
          return reimbursement.manager === 'Denise Martel';
        })
        .reduce((sum, reimbursement: Reimbursement) => {
          return sum + reimbursement.amount;
        }, 0);
      this.remboursementMM = depenseMerlin - reimbursementMerlin;
      this.remboursementDM = depenseDenise - reimbursementDenise;
      this.inProgress = false;
    });

  }
  addReimbursement() {
    window.location.href = '/sites/immoDMMM/1821Bennett/Lists/Remboursement/NewForm.aspx?Source=' + window.location.href;
  }
  goToReimbursementList() {
    window.location.href = '/sites/immoDMMM/1821Bennett/Lists/Remboursement/AllItems.aspx?Source=' + window.location.href;
  }
}
