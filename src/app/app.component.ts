import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import * as firebase from 'firebase';

import { AngularFireAuth } from 'angularfire2/auth';
import { ApiService } from '../common/services/api.service'

const fireCreds = {
	email: "audib85@audib85.com",
	password: "cardiary85"
}

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	rootPage: any = TabsPage;

	constructor(
		platform: Platform, 
		statusBar: StatusBar,
		splashScreen: SplashScreen,
		private firebaseAuth: AngularFireAuth,
		private apiService: ApiService) {

		platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			statusBar.styleDefault();
			splashScreen.hide();

			this.firebaseAuth.auth.signInWithEmailAndPassword(fireCreds.email, fireCreds.password)
			.then(() => {

				firebase.database().ref('/.info/serverTimeOffset')
				.once('value')
				.then(data => {
					let currentDate = new Date(data.val() + Date.now());

					//this.apiService.setCurrentDate(currentDate.toLocaleDateString() + ' ' + currentDate.toTimeString());

					//let currentDate = (currentDate.toLocaleDateString() + ' ' + currentDate.toTimeString())
					this.apiService.setCurrentDate(currentDate);
					// console.log(currentDate.toLocaleDateString() + ' ' + currentDate.toLocaleTimeString())

				}, function (err) {
					return err;
				});

			})
			.catch(() => {
				console.log('noooooooo')
			})

			
		});
	}
}
