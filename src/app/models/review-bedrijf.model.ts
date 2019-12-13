export class ReviewBedrijf {
    constructor(
        public makerId: number,
        public bedrijfId: number,
        public score: number,
        public reviewTekst: string,
        public naarBedrijf: boolean,
    ){}
}
