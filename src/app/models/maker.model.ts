export class Maker {
    constructor(
        public id: number,
        public nickname: string,
        public voornaam: string,
        public achternaam: string,
        public geboorteDatum: Date,
        public biografie: string,
        public linkedInLink: string,
        public ervaring: number,
        public cV: string,
        public foto: string,
        public opdrachtId: number
    ){}
}