export class EmailAddress {

    address: string;
    checked: boolean;

    constructor(address: string, checked: boolean) {
        this.address = address;
        this.checked = checked;
    }
}