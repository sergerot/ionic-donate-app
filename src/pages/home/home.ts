import { EmailPopover } from './saved-mails-popover/mail-popover';
import { EmailAddress } from './../../model/email-address';
import { Email } from './../../model/email';
import { SharedEmailService } from './../../shared/email-service';
import { Component, Input } from '@angular/core';
import { AlertController, NavController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Dialogs } from '@ionic-native/dialogs';
import { Storage } from '@ionic/storage';
import { PopoverController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  imageMax: number = 3;
  emailMax: number = 4;
  email: Email;

  constructor(public navCtrl: NavController, private camera: Camera,
    private alertCtrl: AlertController, private sharedEmailService: SharedEmailService,
    private storage: Storage, private dialogs: Dialogs, private popoverCtrl: PopoverController) {
    this.email = new Email();
  }

  openCamera() {
    let options = this.prepareCameraOptions();
    this.camera.getPicture(options).then((imageData) => {
      // imageData is either a base64 encoded string or a file URI
      // If it's base64:
      let base64Image = `base64:bild${this.email.images.length + 1}.png//` + imageData;
      this.email.images.push(base64Image);
    }, (err) => {
      // Handle error
    });
  }

  private prepareCameraOptions(): CameraOptions {
    const options: CameraOptions = {
      quality: 50,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    return options;
  }

  maximalImagesReached(): boolean {
    return this.email.images.length === this.imageMax;
  }

  sendEmail() {
    this.storage.get('adresses').then((adresses: EmailAddress[]) => {
      if (this.validateEmail(adresses)) {
        this.email.emailAdresses = adresses.filter(adress => adress.checked);
        this.sharedEmailService.sendEmail(this.email);
      }
    });
  }

  deleteImages() {
    this.confirmImageDelete();
  }

  private confirmImageDelete() {
    let alert = this.alertCtrl.create({
      title: 'Confirm delete',
      message: 'Do you want to delete all images?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.email.images = [];
          }
        }
      ]
    });
    alert.present();
  }

  private validateEmail(adresses: EmailAddress[]): boolean {
    if (this.email.emailText === undefined || this.email.emailText === '') {
      this.dialogs.alert('Email Text darf nicht leer sein!').then(() => console.log('Dialog dismissed'))
        .catch(e => console.log('Error displaying dialog', e));
      return false;
    }

    if ((this.email.targetDonate === undefined || (!this.email.targetDonate.match(/^\d+$/) && !this.email.targetDonate.match(/^\d+\.\d+$/)))) {
      this.dialogs.alert('Zielbetrag muss eine Zahl sein!').then(() => console.log('Dialog dismissed'))
        .catch(e => console.log('Error displaying dialog', e));
      return false;
    }

    if (adresses.length === 0) {
      this.dialogs.alert('Es muss mindestens eine Emailadresses angegeben werden (unter dem tab Contact)!').then(() => console.log('Dialog dismissed'))
        .catch(e => console.log('Error displaying dialog', e));
      return false;
    }

    if (adresses.find(mail => mail.checked) === undefined) {
      this.dialogs.alert('Es muss mindestens eine Emailadresse zum Versand aktiviert werden (Aktivierung unter dem tab Contact)!').then(() => console.log('Dialog dismissed'))
        .catch(e => console.log('Error displaying dialog', e));
      return false;
    }

    return true;
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(EmailPopover);
    popover.onDidDismiss((email: Email) => {
      if (email) {
        this.email = new Email();
        this.email = email;
      }
    });
    popover.present({
      ev: myEvent
    });
  }

  saveEmailPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Save',
      message: 'Speichere diese Email. Tippe hierfuer einen Namen fuer die Email ein.',
      inputs: [{
        name: 'Name',
        placeholder: '...'
      }],
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Speichern',
          handler: (data) => {
            this.saveEmail(data.Name);
          }
        }
      ]
    });
    alert.present();
  }

  private saveEmail(name: string) {
    this.storage.get('emails').then((emails: Email[]) => {
      let allMails = this.checkIfFirstElement(emails);
      let mailCounter = allMails.length;
      if (this.checkIfEmailCounterReached(mailCounter)) {
        this.email.name = this.checkName(name, mailCounter);
        allMails.push(this.email);
        this.storage.set('emails', allMails);
      }
    });
  }

  private checkIfFirstElement(emails: Email[]): Email[] {
    if (emails === null) {
      return [];
    }
    return emails;
  }

  private checkName(name: string, mailCounter: number): string {
    if (name && name !== ' ') {
      return name;
    }
    return 'unnamed' + mailCounter;
  }

  private checkIfEmailCounterReached(max: number): boolean {
    if (max === this.emailMax) {
      this.emailMaxReachedNotification();
      return false;
    }
    return true;
  }

  private emailMaxReachedNotification() {
    let alert = this.alertCtrl.create({
      title: 'Emails',
      message: `Maximale Anzahl der Emails (${this.emailMax}) erreicht. Loesche Emails um speichern zu koennen.`,
      buttons: [
        {
          text: 'OKAY',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

  newEmail() {
    let alert = this.alertCtrl.create({
      title: 'Refresh',
      message: 'Sicher dass du diese email loeschen willst. Die Eingaben gehen verloren.',
      buttons: [
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: 'Loeschen',
          handler: () => {
            this.email = new Email();
          }
        }
      ]
    });
    alert.present();
  }

}
