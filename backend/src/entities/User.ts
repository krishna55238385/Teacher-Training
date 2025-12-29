import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, OneToOne } from "typeorm";
import { ScenarioAttempt } from "./ScenarioAttempt.js";
import { TeacherEvaluation } from "./TeacherEvaluation.js";

export enum UserRole {
    TEACHER = "TEACHER",
    ADMIN = "ADMIN",
}

@Entity("users")
export class User {
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Column()
    name!: string;

    @Column({ unique: true })
    email!: string;

    @Column({ select: false })
    password!: string;

    @Column({
        type: "enum",
        enum: UserRole,
        default: UserRole.TEACHER,
    })
    role!: UserRole;

    @Column({ nullable: true })
    phone?: string;

    @Column({ nullable: true })
    subject?: string;

    @Column({ default: 0 })
    yearsOfExperience?: number;

    @Column({ nullable: true })
    institution?: string;

    @Column({ nullable: true })
    avatar?: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    @OneToMany(() => ScenarioAttempt, (attempt) => attempt.user)
    scenarioAttempts!: ScenarioAttempt[];

    @OneToOne(() => TeacherEvaluation, (evaluation) => evaluation.user)
    evaluation?: TeacherEvaluation;
}
