import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ required: true, trim: true })
    displayName: string;

    @Prop({ default: 'player' })
    role: 'admin' | 'player'
}

export const UserSchema = SchemaFactory.createForClass(User);
export type UserDocument = HydratedDocument<User>;
