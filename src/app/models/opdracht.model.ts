import { OpdrachtMaker } from './opdracht-maker.model';
import { Bedrijf } from './bedrijf.model';

export class Opdracht {
    constructor(
        public id: number,
        public titel: string,
        public omschrijving: string,
        public bedrijfId:number,
        public straat:string,
        public straatNr:string,
        public postcode:string,
        public woonPlaats:string,
        public opdrachtMakers: OpdrachtMaker[],
        public bedrijf:Bedrijf,
        public open:boolean,
        public klaar:boolean,
        public interest:number
    ){}
}