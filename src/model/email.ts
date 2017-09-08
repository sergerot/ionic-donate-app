import { EmailAddress } from './email-address';
export class Email {
    emailText: string;
    vers: string;
    targetDonate: string;
    images: any[] = [];
    emailAdresses: EmailAddress[] = [];
    name: string;

    constructor() {
        this.emailText = '';
        this.vers = '';
        this.targetDonate = '';
        this.images = [];
        this.emailAdresses = [];
        this.name = '';
    }
}