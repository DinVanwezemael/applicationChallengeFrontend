import { Bedrijf } from './bedrijf.model';
import { Tag } from './tag.model';

export class BedrijfTag {
    constructor(
        public id: number,
        public bedrijfId: number,
        public tagId:number,
        public bedrijf:Bedrijf,
        public tag:Tag){}
}