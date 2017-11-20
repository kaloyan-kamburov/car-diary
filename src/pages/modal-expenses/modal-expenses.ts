import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from 'angularfire2/database';

import { ApiService } from '../../common/services/api.service';

import * as firebase from 'firebase';


/**
 * Generated class for the ModalExpensesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */ 

@IonicPage({ name: 'ModalExpenses' })
@Component({
	selector: 'page-modal-expenses',
	templateUrl: 'modal-expenses.html',
})
export class ModalExpensesPage {
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
			'type': ['', Validators.required],
			'title': ['', Validators.required],
			'date_added': ['', Validators.required],
			'location': ['', Validators.required],
			'description': ['', Validators.required],
			'price': ['', Validators.required],
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
			this.form.controls['type'].setValue(this.currentRecord.type);
			this.form.controls['title'].setValue(this.currentRecord.title);
			this.form.controls['date_added'].setValue(this.currentRecord.date_added);
			this.form.controls['location'].setValue(this.currentRecord.location);
			this.form.controls['description'].setValue(this.currentRecord.description);
			this.form.controls['price'].setValue(this.currentRecord.price);

		}

	}

	saveRecord(formValue) {
		this.loading.present();

		if (this.isEditMode) {
			this.db.list('expenses').update(this.currentRecord.key, formValue).then(() => {
				this.loading.dismiss();
			});
		} else {
			let obj = formValue;

			let elementRef = firebase.database().ref('/expenses').push(obj);

			obj.key = elementRef.key;

			elementRef.update(obj).then(() => {
				this.loading.dismiss();
			});
		}		 
		 
		this.closeModal();
	}

	closeModal() {
		this.viewController.dismiss({
			allRecordsVisible: this.allRecordsVisible
		});
	}

}
