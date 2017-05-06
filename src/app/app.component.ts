import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'app works!';
  constructor(private router: Router) {
    console.log('app.component !');
  }
  goToExpenses(event) {
    this.router.navigate(['/expenses']);
    event.preventDefault();
    event.stopPropagation();
  }
  goToTaxes(event) {
    this.router.navigate(['/taxes']);
    event.preventDefault();
    event.stopPropagation();
  }
  goToReimbursement(event) {
    this.router.navigate(['/reimbursement']);
    event.preventDefault();
    event.stopPropagation();
  }
  goToTest(event) {
    this.router.navigate(['/test']);
    event.preventDefault();
    event.stopPropagation();
  }
}
