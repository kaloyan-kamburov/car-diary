import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';

import { ApiService } from '../../common/services/api.service';

import * as firebase from 'firebase';


/**
 * Generated class for the ModalFuelPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */ 

@IonicPage({ name: 'ModalFuel' })
@Component({
	selector: 'page-modal-fuel',
	templateUrl: 'modal-fuel.html',
})
export class ModalFuelPage {
	public form: FormGroup;
	public recordDate: string;
	public isCurrentDate: boolean = true;
	public isEditMode: boolean = false;
	public allRecordsVisible: boolean;
	public currentRecord;
	public recordPrice: any;
	public loading;

	constructor(
		public loadingCtrl: LoadingController,
		public navCtrl: NavController, 
		public navParams: NavParams,
		private fb: FormBuilder,
		private viewController: ViewController,
		private db: AngularFireDatabase,
		private apiService: ApiService
	) {

		this.form = this.fb.group({
			'mileage': ['', Validators.required],
			'station': ['', Validators.required],
			'per_liter': ['', Validators.required],
			'quantity': ['', Validators.required],
			'date_added': ['', Validators.required]
		});
	}

	useDate() {
		this.isCurrentDate = !this.isCurrentDate;
	}

	ionViewDidLoad() {
		this.isEditMode = this.navParams.get('editMode');
		this.allRecordsVisible = this.navParams.get('allRecordsVisible');
		
		this.loading = this.loadingCtrl.create({
			spinner: 'crescent',
			content: 'Записване...'
		});
		
		if (!this.isEditMode) {
			this.recordDate = this.apiService.getCurrentDate();
			this.form.controls['date_added'].setValue(this.recordDate);
		} else {
			this.currentRecord = this.navParams.get('record');

			this.form.controls['mileage'].setValue(this.currentRecord.mileage);
			this.form.controls['station'].setValue(this.currentRecord.station);
			this.form.controls['per_liter'].setValue(this.currentRecord.per_liter);
			this.form.controls['quantity'].setValue(this.currentRecord.quantity);
			this.form.controls['date_added'].setValue(this.currentRecord.date_added);

			this.recordPrice = this.form.controls['per_liter'].value * this.form.controls['quantity'].value;
		}

	}

	saveRecord(formValue) {
		this.loading.present();

		if (this.isEditMode) {
			this.db.list('fuel').update(this.currentRecord.key, formValue).then(() => {
				this.loading.dismiss();
			});
		} else {
			let obj = formValue;
			obj.price = this.recordPrice;

			let elementRef = firebase.database().ref('/fuel').push(obj);

			obj.key = elementRef.key;

			elementRef.update(obj).then(() => {
				this.loading.dismiss();
			})
		}		 
		 
		this.closeModal();
	}

	calcPrice() {
		this.recordPrice = Math.floor( (this.form.controls['per_liter'].value * this.form.controls['quantity'].value) * 100) /100;
	}

	closeModal() {
		this.viewController.dismiss({
			allRecordsVisible: this.allRecordsVisible
		});
	}

}
