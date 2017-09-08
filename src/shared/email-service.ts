import { Email } from './../model/email';
import { Injectable } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer';

@Injectable()
export class SharedEmailService {

    constructor(private emailComposer: EmailComposer) { }

    sendEmail(email: Email) {
        this.emailComposer.isAvailable().then((available: boolean) => {
            if (available) {
                //Now we know we can send
            }
        });

        let emailSend = {
            to: email.emailAdresses.map(emailAd => emailAd.address),
            cc: [],
            bcc: [],
            attachments: email.images,
            subject: 'Zielspende '+ email.targetDonate,
            body: this.prepareEmailText(email),
            isHtml: false
        };

        // Send a text message using default options
        this.emailComposer.open(emailSend);
    }

    private prepareEmailText(email: Email): string {
        if (email.vers) {
            return `${email.emailText} \n-------\n${email.vers}`
        }
        return email.emailText;
    }
}