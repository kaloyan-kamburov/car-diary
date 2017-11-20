import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalExpensesPage } from './modal-expenses';

@NgModule({
  declarations: [
    ModalExpensesPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalExpensesPage),
  ],
})
export class ModalExpensesPageModule {}
