import { Opdracht } from './opdracht.model';
import { Tag } from './tag.model';

export class OpdrachtTag {
    constructor(
        public id: number,
        public opdrachtId: number,
        public tagId:number,
        public opdracht:Opdracht,
        public tag:Tag){}
}