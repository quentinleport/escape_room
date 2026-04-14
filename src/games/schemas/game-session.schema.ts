import { Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { GameStatus } from '../game-status';

export class GameSession {
    @Prop({ required: true, unique: true, uppercase: true })
    code: string;

    @Prop({ required: true, enum: GameStatus, default: GameStatus.WAITING })
    status: GameStatus;

    @Prop({ required: true, ref: 'User', type: Types.ObjectId })
    hostId: Types.ObjectId;

    @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
    playerIds: Types.ObjectId[];

    @Prop() startedAt: Date;

    @Prop() finishedAt: Date;
}

export const GameSessionSchema = SchemaFactory.createForClass(GameSession);
export type GameSessionDocument = HydratedDocument<GameSession>;
