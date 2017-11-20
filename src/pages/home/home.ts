import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import * as firebase from 'firebase';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})

export class HomePage {
	public loading;
	public currentUser;
	public lastFuelMileage;
	public lastExpenseMileage;
	public noFuelRecors: boolean = true;
	public noExpensesRecords: boolean = true;

	constructor(
		public loadingCtrl: LoadingController,
		public navCtrl: NavController,
		private db: AngularFireDatabase
	) {
		
	}

	ionViewDidLoad() {
		// this.loading = this.loadingCtrl.create({
		// 	spinner: 'crescent',
		// 	content: 'Зареждане...'
		// });

		// this.loading.present();

		// setTimeout(() => {
		// 	if (firebase.auth().currentUser) {
		// 		this.loading.dismiss();
		// 	}
		// }, 1000)
	}

	ionViewDidEnter() {
		this.db.list('fuel').valueChanges().subscribe((records) => {
			if (records.length > 0) {
				this.noFuelRecors = false;
				this.lastFuelMileage = records[records.length -1]['mileage'];
			}
		});

		this.db.list('expenses').valueChanges().subscribe((records) => {
			if (records.length > 0) {
				this.noExpensesRecords = false;
				this.lastExpenseMileage = records[records.length -1]['mileage'];
			}
		});
	}

}
