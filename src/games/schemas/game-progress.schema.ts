import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export class GameProgress {
    @Prop({ type: Types.ObjectId, ref: 'GameSession', required: true })
    sessionId: Types.ObjectId;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    userId: Types.ObjectId;

    @Prop({ type: [Object], default: [] })
    answers: object[];

    @Prop({ default: 0 }) score: number;
    @Prop() completedAt: Date;
}

export const GameProgressSchema = SchemaFactory.createForClass(GameProgress);
export type GameProgressDocument = HydratedDocument<GameProgress>;
