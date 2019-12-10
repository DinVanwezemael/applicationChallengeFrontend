export class Review {
    constructor(
        public id: number,
        public studentId: number,
        public bedrijfId: number,
        public score: number,
        public reviewTekst: string,
        public naarBedrijf: boolean
    ){}
}
