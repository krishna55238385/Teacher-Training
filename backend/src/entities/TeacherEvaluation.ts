import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { User } from "./User.js";

@Entity("teacher_evaluations")
export class TeacherEvaluation {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: string;

    @Column({ type: "text" })
    llmSummary!: string;

    @OneToOne(() => User, (user) => user.evaluation)
    @JoinColumn({ name: "userId" })
    user!: User;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
