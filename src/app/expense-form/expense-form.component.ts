import { Component, OnInit } from '@angular/core';
import {FormGroup, FormControl, FormBuilder, Validators} from '@angular/forms';
import {Params, ActivatedRoute, Router} from "@angular/router";
import {SpDataService} from "../sp-data/spdata.service";
import {Expense} from "../model/expense.model";
import {TaxesCategory} from "../model/taxesCategory.model";
import {Provider} from "../model/provider.model";
// import * as fabric from 'office-ui-fabric-js/dist/js/fabric.js';

declare var fabric: any;

@Component({
  selector: 'app-expense-form',
  templateUrl: './expense-form.component.html',
  styleUrls: ['./expense-form.component.css']
})
export class ExpenseFormComponent implements OnInit {
  idFromRoute: number;
  currentItem: Expense;
  taxCategories: TaxesCategory[];
  providers: Provider[];
  managers: string[] = ['Merlin Martel', 'Denise Martel', 'Compte Maison Bennett'];
  flats:any;

  editForm = new FormGroup({
    title: new FormControl(),
    manager: new FormControl(),
    date: new FormControl(),
    flatId: new FormControl({Disabled: true}),
    price: new FormControl(),
    providerId: new FormControl({disabled: true}),
    taxCategoryId: new FormControl({disabled: true}),
    validated: new FormControl(),
    p: new FormControl()
  });
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private spDataService: SpDataService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.idFromRoute = +params['id']; // (+) converts string 'id' to a number
    });
    this.spDataService.getExpense(this.idFromRoute).subscribe(item => {
      console.log(item);
      this.currentItem = item;
      this.setFormFromData(this.editForm, this.currentItem); // Set the form with loaded data;
    });
    this.spDataService.getTaxCategories().subscribe(res => {
      this.taxCategories = res;
    });
    this.spDataService.getProviders().subscribe(res => {
      this.providers = res;
    });

  }
  private setFormFromData(editForm, currentItem: Expense) {
    editForm.controls.title.setValue(currentItem.title);
    editForm.controls.manager.setValue(currentItem.manager);
    editForm.controls.date.setValue(currentItem.date);
    editForm.controls.flatId.setValue(currentItem.flatId);
    editForm.controls.price.setValue(currentItem.price);
    editForm.controls.providerId.setValue(currentItem.providerId);
    editForm.controls.taxCategoryId.setValue(currentItem.taxCategoryId);
    editForm.controls.validated.setValue(currentItem.validated);
    editForm.controls.p.setValue(currentItem.p);
  }
  private setDataFromForm() {
    this.currentItem.title = this.editForm.controls['title'].value;
    this.currentItem.manager = this.editForm.controls['manager'].value;
    this.currentItem.date = this.editForm.controls['date'].value;
    this.currentItem.flatId = this.editForm.controls['flatId'].value;
    this.currentItem.price = this.editForm.controls['price'].value;
    this.currentItem.providerId = this.editForm.controls['providerId'].value;
    this.currentItem.taxCategoryId = this.editForm.controls['taxCategoryId'].value;
    this.currentItem.validated = this.editForm.controls['validated'].value;
    this.currentItem.p = this.editForm.controls['p'].value;
  }
  private cancel() {
    this.router.navigate(['/expenses']);
  }
  updateExpense() {
    this.setDataFromForm();
    this.spDataService.updateExpense2(this.currentItem).subscribe(res => {
      console.log(res);
      this.router.navigate(['/expenses']);
    });
  }
}
