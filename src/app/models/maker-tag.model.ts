import { Maker } from './maker.model';
import { Tag } from './tag.model';

export class MakerTag {

    constructor(
        public id: number,
        public makerId: number,
        public tagId:number,
        public maker:Maker,
        public tag:Tag,
        public selfSet: boolean,
        public interest: number
        ){}

}
 