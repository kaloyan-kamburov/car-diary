import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

@Component({
	selector: 'page-home',
	templateUrl: 'home.html'
})

export class HomePage {
	public loading;
	public currentUser;
	
	public lastFuelMileage;
	public lastExpenseMileage;
	public noFuelRecords: boolean = true;
	public noExpensesRecords: boolean = true;

	public kilometers;
	public averageConsumption;
	public milagePrice;
	public litersQuantity;

	public expensesTotal;
	public preferredGasStations = [];
	public gasStations = {};
	public maxGasStationVisits = 0;
	public gasStationValues = [];

	constructor(
		public loadingCtrl: LoadingController,
		public navCtrl: NavController,
		private db: AngularFireDatabase
	) {
		
	}

	//ionViewDidLoad() {
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
	//}

	calculateFuelData(records) {
		this.gasStations = {};
		this.gasStationValues = [];
		this.maxGasStationVisits = 0;
		this.preferredGasStations = [];
		this.milagePrice = 0;
		this.litersQuantity = 0;
		this.averageConsumption = 0;

		for (let record of records) {
			this.milagePrice += record.price;
			this.litersQuantity = parseFloat(this.litersQuantity) + parseFloat(record.quantity);
		
			if (this.gasStations.hasOwnProperty(record.station)) {
				this.gasStations[record.station]++;
			} else {
				this.gasStations[record.station] = 1;
			}
		}
		
		this.litersQuantity = this.litersQuantity.toFixed(2);
		this.milagePrice = Number(this.milagePrice).toFixed(2);

		Object.keys(this.gasStations).forEach((key) => {
			this.gasStationValues.push(this.gasStations[key])
		});
		
		this.maxGasStationVisits = Math.max(...this.gasStationValues);//this.gasStations[this.preferredGasStation];

		Object.keys(this.gasStations).forEach((key, index) => {

			if (this.gasStations[key] === this.maxGasStationVisits) {
				this.preferredGasStations.push(key)
			}

		});

		this.kilometers = records[records.length - 1].mileage - records[0].mileage;
		this.averageConsumption = ( 100 / ( Number(this.kilometers) / Number(this.litersQuantity) ) ).toFixed(2);
		this.lastFuelMileage = records[records.length -1]['mileage'];
	}

	calculateExpensesData(records) {
		this.expensesTotal = 0;

		this.lastExpenseMileage = records[records.length -1]['mileage'];
		
		for (let record of records) {
			this.expensesTotal = Number(this.expensesTotal) + Number(record.price);
		}

		this.expensesTotal = this.expensesTotal.toFixed(2);
	}

	ionViewDidLoad() {
		this.db.list('fuel').valueChanges().subscribe((records) => {
			
			if (records.length > 0) {
				this.noFuelRecords = false;
				this.calculateFuelData(records);
			} else {
				this.noFuelRecords = true;
			}

		});

		this.db.list('expenses').valueChanges().subscribe((records) => {
			if (records.length > 0) {
				this.noExpensesRecords = false;
				this.calculateExpensesData(records);

			}
		});
	}

}
