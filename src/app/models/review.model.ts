export class Review {
    constructor(
        public id: number,
        public makerId: number,
        public bedrijfId: number,
        public score: number,
        public reviewTekst: string,
        public naarBedrijf: boolean
    ){}
}
