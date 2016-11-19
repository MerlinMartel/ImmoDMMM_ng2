export class TaxesCategory {
  title: string;
  number: number;
  taxeCategory: number;
  sum: number;
  percentagePersonalDM: number;
  percentagePersonalMM: number;
  sumPersonalDM: number;
  sumPersonalMM: number;

  constructor () {
    this.sum = 0;
    this.percentagePersonalDM = 0;
    this.percentagePersonalMM = 0;
    this.sumPersonalDM = 0;
    this.sumPersonalMM = 0;
  }
}
