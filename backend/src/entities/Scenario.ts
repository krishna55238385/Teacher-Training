import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";

@Entity("scenarios")
export class Scenario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    title!: string;

    @Column("text")
    description!: string;

    @Column()
    difficulty!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
