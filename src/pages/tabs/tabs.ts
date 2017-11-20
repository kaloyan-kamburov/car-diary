import { Component } from '@angular/core';

import { ExpensesPage } from '../expenses/expenses';
import { HomePage } from '../home/home';
import { MileagePage } from '../mileage/mileage';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = ExpensesPage;
  tab3Root = MileagePage;

  constructor() {

  }
}
