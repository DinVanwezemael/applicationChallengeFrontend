import { Maker } from './maker.model';
import { Bedrijf } from './bedrijf.model';

export class UserLogin {
    constructor(
        public id: number,
        public username: string,
        public email: string,
        public userTypeId: number,
        public makerId?: number,
        public bedrijfId?: number,
        public maker?: Maker,
        public bedrijf?: Bedrijf
    ){}
}
