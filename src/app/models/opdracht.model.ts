export class Opdracht {
    constructor(
        public id: number,
        public titel: string,
        public omschrijving: string,
        public bedrijfId:number,
        public straat:string,
        public straatNr:string,
        public postcode:string,
        public woonPlaats:string
    ){}
}