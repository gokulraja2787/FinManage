import { FinManagePage } from './app.po';

describe('fin-manage App', () => {
  let page: FinManagePage;

  beforeEach(() => {
    page = new FinManagePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
