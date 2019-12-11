import { Opdracht } from './opdracht.model';

export class Bedrijf {
    constructor(
        public id: number,
        public naam: string,
        public postcode: string,
        public straat: string,
        public straatnr: string,
        public woonplaats: string,
        public biografie: string,
        public foto: string,
        public opdrachten:Opdracht[]
    ){}
}
