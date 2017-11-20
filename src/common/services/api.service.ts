import { Injectable } from '@angular/core';

@Injectable()
export class ApiService {
    public currentDate;

    constructor() {

    }

    setCurrentDate(date) {
        
        this.currentDate = date.toLocaleDateString().split('/');
        this.currentDate = this.currentDate[1] + '/' + this.currentDate[0] + '/' + this.currentDate[2] + ' ' + date.toLocaleTimeString();
    }

    getCurrentDate() {
        return this.currentDate;
    }
}