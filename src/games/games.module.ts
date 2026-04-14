import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersModule } from "../users/users.module";
import { GamesService } from "./games.service";
import { GamesController } from "./games.controller";
import { AuthModule } from "../auth/auth.module";
import { GameSession, GameSessionSchema } from "./schemas/game-session.schema";
import { GameProgress, GameProgressSchema } from "./schemas/game-progress.schema";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: GameSession.name, schema: GameSessionSchema },
            { name: GameProgress.name, schema: GameProgressSchema },
        ]),
        UsersModule,
        AuthModule
    ],
    providers: [GamesService],
    controllers: [GamesController]
})
export class GamesModule { }