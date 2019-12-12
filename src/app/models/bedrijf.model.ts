import { Opdracht } from './opdracht.model';

export class Bedrijf {
    constructor(
        public id: number,
        public naam: string,
        public postcode: string,
        public straat: string,
        public nr: string,
        public stad: string,
        public biografie: string,
        public foto: string,
        public opdrachten:Opdracht[]
    ){}
}
