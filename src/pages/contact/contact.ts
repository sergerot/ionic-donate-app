import { EmailAddress } from './../../model/email-address';
import { Component, Input } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  @Input()
  address: string = '';
  addresses: EmailAddress[] = [];

  constructor(public navCtrl: NavController, private storage: Storage) {
  }

  ionViewWillEnter() {
    this.storage.get('adresses').then((adresses) => {
      if (adresses) {
        this.addresses = adresses;
      }
    });
  }

  addEmailAddress() {
    if (this.address) {
      this.addresses.push(new EmailAddress(this.address, false));
      this.address = ''
      this.saveAdresses();
    }
  }

  removeEmailAddress(emailAddress: EmailAddress) {
    var index = this.addresses.indexOf(emailAddress);
    if (index > -1) {
      this.addresses.splice(index, 1);
      this.saveAdresses();
    }
  }

  emailDataChanged() {
    this.saveAdresses();
  }

  private saveAdresses() {
    this.storage.set('adresses', this.addresses);
  }

}
