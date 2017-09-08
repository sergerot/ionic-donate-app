import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  reached: string = '48';

  constructor(public navCtrl: NavController) {

  }

}
