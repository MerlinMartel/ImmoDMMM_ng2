import { ExpenseListPage } from './app.po';

describe('expense-list App', function() {
  let page: ExpenseListPage;

  beforeEach(() => {
    page = new ExpenseListPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
