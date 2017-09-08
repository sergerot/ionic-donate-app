import { Email } from './../../../model/email';
import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { Storage } from '@ionic/storage';


@Component({
  template: `
    <ion-list>
    <ion-list-header>Saved Mails</ion-list-header>
    <ion-item *ngFor="let mail of savedMails">
      <ion-icon name="done-all"></ion-icon>
      <ion-label (click)="choose(mail)">{{mail.name}}</ion-label>
      <button (click)="removeSavedEmail(mail)" ion-button clear item-right>
      <ion-icon name="remove-circle"></ion-icon>
    </button>
    </ion-item>
  </ion-list>
  `
})
export class EmailPopover {

  savedMails: Email[] = [];

  constructor(public viewCtrl: ViewController, private storage: Storage) {
    this.checkOutMails()
  }

  choose(email: Email) {
    this.viewCtrl.dismiss(email);
  }

  checkOutMails() {
    this.storage.get('emails').then((emails) => {
      this.savedMails = emails;
    });
  }

  removeSavedEmail(email: Email) {
    var index = this.savedMails.indexOf(email);
    if (index > -1) {
      this.savedMails.splice(index, 1);
      this.updateEmailStorage('emails');
    }
  }

  updateEmailStorage(key: string) {
    this.storage.set(key, this.savedMails);
  }
}
