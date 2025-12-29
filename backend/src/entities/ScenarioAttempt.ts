import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Unique } from "typeorm";
import { User } from "./User.js";
import { Scenario } from "./Scenario.js";

export enum ScenarioStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
}

@Entity("scenario_attempts")
@Unique(["userId", "scenarioId"])
export class ScenarioAttempt {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    userId!: string;

    @Column()
    scenarioId!: string;

    @Column({
        type: "enum",
        enum: ScenarioStatus,
        default: ScenarioStatus.NOT_STARTED,
    })
    status!: ScenarioStatus;

    @Column({ nullable: true })
    score?: number;

    @Column({ nullable: true })
    toughTongueSessionId?: string;

    @Column({ type: "json", nullable: true })
    toughTongueData?: any;

    @Column({ type: "text", nullable: true })
    feedback?: string;

    @ManyToOne(() => User, (user) => user.scenarioAttempts)
    @JoinColumn({ name: "userId" })
    user!: User;

    @ManyToOne(() => Scenario)
    @JoinColumn({ name: "scenarioId" })
    scenario!: Scenario;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;
}
