import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { UpdateGameSessionDto } from "./dto/update-game-session.dto";
import { GameStatus } from "./game-status";
import { GameProgress } from "./schemas/game-progress.schema";
import { GameSession, GameSessionDocument } from "./schemas/game-session.schema";

@Injectable()
export class GamesService {
    constructor(
        @InjectModel(GameSession.name) private gameSession: Model<GameSession>,
        @InjectModel(GameProgress.name) private gameProgress: Model<GameProgress>,
    ) { }

    async create(hostId: string) {
        const code = this.generateCode();
        return this.gameSession.create({ code, hostId, playerIds: [new Types.ObjectId(hostId)] });

    }

    async findByCode(code: string): Promise<GameSessionDocument> {
        const session = await this.gameSession.findOne({ code }).exec();
        if (!session) {
            throw new NotFoundException('Session not found');
        }
        return session;
    }

    async join(code: string, userId: string) {
        const session = await this.findByCode(code);
        if (session.status != GameStatus.WAITING) {
            throw new ForbiddenException('Session already started')
        }
        const uuid = new Types.ObjectId(userId);
        if (!session.playerIds.some((id) => id.equals(uuid))) {
            session.playerIds.push(uuid);
            await session.save();
        }
        return session
    }

    public async updateGameSessionStatus(dto: UpdateGameSessionDto, code: string, userId: string) {
        switch (dto.status) {
            case GameStatus.FINISHED:
                return this.finish(code, userId);
            case GameStatus.ACTIVE:
                return this.start(code, userId);
            default:
                throw new BadRequestException('Invalid game status update');
        }
    }

    private async start(code: string, userId: string) {
        const session = await this.findByCode(code);
        this.checkHostOwnership(session, userId);

        if (session.status != GameStatus.WAITING) {
            throw new ForbiddenException('Session already started');
        }
        session.startedAt = new Date();
        session.status = GameStatus.ACTIVE;
        await session.save();
        return session;
    }

    private async finish(code: string, userId: string) {
        const session = await this.findByCode(code);
        this.checkHostOwnership(session, userId);
        if (session.status != GameStatus.ACTIVE) {
            throw new ForbiddenException('Session has not started yet');
        }
        session.status = GameStatus.FINISHED;
        session.finishedAt = new Date();
        await session.save();
        return session;
    }

    async submitProgress(code: string, userId: string, answers: [], score: number) {
        const session = await this.findByCode(code);
        const uid = new Types.ObjectId(userId);
        const sessionProgress = await this.gameProgress.findOne({ sessionId: session._id, userId: uid }).exec();
        if (!sessionProgress) {
            return this.gameProgress.create({
                sessionId: session._id,
                userId: uid,
                answers,
                score,
                completedAt: new Date()
            });

        }
        sessionProgress.answers = answers;
        sessionProgress.score = score;
        sessionProgress.completedAt = new Date();
        await sessionProgress.save();
        return session;
    }

    async getMyProgress(code: string, userId: string) {
        const session = await this.findByCode(code);
        const uid = new Types.ObjectId(userId);
        const sessionProgress = await this.gameProgress.findOne({ sessionId: session._id, userId: uid }).exec();
        if (!sessionProgress) {
            throw new NotFoundException('The user has not submitted any answer yet')
        }
        return sessionProgress;
    }

    private generateCode(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    private checkHostOwnership(session: GameSessionDocument, userId: string) {
        if (session.hostId != new Types.ObjectId(userId)) {
            throw new ForbiddenException('The session must be handled by the host');
        }
    }

}
