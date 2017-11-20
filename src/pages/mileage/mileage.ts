import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ModalController, LoadingController, AlertController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';

import { Content } from 'ionic-angular';

/**
 * Generated class for the MileagePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
	selector: 'page-mileage',
	templateUrl: 'mileage.html',
})
export class MileagePage {
	@ViewChild(Content) public content: Content;

	public fuelRecords = [];
	public expandedRecord: any;
	public loading;
	public alert;
	public noRecords: boolean = true;
	public allRecordsVisible: boolean = false;
	public dbQuery;

	constructor(
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public navCtrl: NavController,
		public navParams: NavParams,
		private db: AngularFireDatabase,
		private modalCtrl: ModalController
	) {
	}

	ionViewDidEnter() {

	}

	ionViewDidLoad() {

		
		this.loading = this.loadingCtrl.create({
			spinner: 'crescent',
			content: 'Зареждане...'
		});

		this.loading.present();
		

		this.db.list('fuel', ref => ref.limitToLast(6)).valueChanges().subscribe(records => {
			
			if (records && records.length) {				
				this.fuelRecords = records;
				this.noRecords = false;
				this.allRecordsVisible = records.length < 6;

			} else {
				setTimeout( () => {
					this.allRecordsVisible = true;
					this.noRecords = true;
					this.fuelRecords = [];
				}, 1000);
			}
			
			this.loading.dismiss();
		});
	}

	showAllRecords() {		
		this.loading = this.loadingCtrl.create({
			spinner: 'crescent',
			content: 'Зареждане...'
		});
		
		this.loading.present();

		this.db.list('fuel').valueChanges().subscribe(records => {
			this.fuelRecords = records;
			this.allRecordsVisible = true;
			this.loading.dismiss();
		});

		setTimeout(() => {
			this.content.scrollToBottom();
		}, 1);
	}

	isRecordOpen(record) {
		return this.expandedRecord === record;
	}

	toggleRecordDetails(record) {
		if (this.isRecordOpen(record)) {
			this.expandedRecord = null;
		} else {
			this.expandedRecord = record;
		}
	}

	addRecord() {
		let params = {
			editMode: false
		},
		modal = this.modalCtrl.create('ModalFuel', params);
		modal.present();
	}

	editRecord(record) {
		let params = {
			editMode: true,
			record: record,
			allRecordsVisible: this.allRecordsVisible
		},
		modal = this.modalCtrl.create('ModalFuel', params);
		modal.present();
	}

	deleteRecord(record) {
		this.alert = this.alertCtrl.create({
			title: 'Изтриване на запис',
			message: 'Искате ли да изтриете този запис?',
			buttons: [
				{
					text: 'Отказ',
					role: 'cancel'
				},
				{
					text: 'Изтрий',
					handler: () => {						
						this.db.list('fuel', ref => ref.limitToLast(6)).remove(record.key);

						// if (this.allRecordsVisible) {
						// 	this.showAllRecords();
						// }
					}
				}
			]
		});

		this.alert.present();
	}

}
