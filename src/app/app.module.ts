import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { MileagePage } from '../pages/mileage/mileage';
import { ExpensesPage } from '../pages/expenses/expenses';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { ApiService } from '../common/services/api.service';

import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';


const fireBaseConfig = {
	apiKey: "AIzaSyBm8Ce2oCbDLaJLBqolbnEkv-n9-OOF9V4",
	authDomain: "cardiary-21f09.firebaseapp.com",
	databaseURL: "https://cardiary-21f09.firebaseio.com",
	projectId: "cardiary-21f09",
	storageBucket: "",
	messagingSenderId: "108361378319"
};

@NgModule({
	declarations: [
		MyApp,
		ExpensesPage,
		HomePage,
		TabsPage,
		MileagePage
	],
	imports: [
		BrowserModule,
		AngularFireAuthModule,
		IonicModule.forRoot(MyApp),
		AngularFireModule.initializeApp(fireBaseConfig)
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		ExpensesPage,
		HomePage,
		TabsPage,
		MileagePage
	],
	providers: [
		StatusBar,
		SplashScreen,
		AngularFireAuthModule,
		AngularFireDatabase,
		ApiService,
		{ provide: ErrorHandler, useClass: IonicErrorHandler }
	]
})
export class AppModule { }
