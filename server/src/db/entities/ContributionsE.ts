import { Entity, Column } from 'typeorm';
import { _BaseEntity } from './_BaseEntity';

@Entity('contributions')
export class ContributionsE extends _BaseEntity implements EN.IContributionsE {
    @Column()
    y: number;
    @Column()
    m: number;
    @Column()
    d: number;
    @Column('text')
    type: EN.ContributionsEType;
    @Column('text')
    conType: EN.ContributionsEConType;
    @Column()
    targetId: number;
    @Column()
    userId: number;

    data: any;
}
