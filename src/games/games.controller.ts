import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { GamesService } from "./games.service";
import { CurrentUser } from "../common/decorators/user.decorator";
import type { UserDocument } from "../users/schemas/user.schema";
import { UpdateGameSessionDto } from "./dto/update-game-session.dto";
import { SubmitProgress } from "./dto/submit-progress.dto";

@Controller('games')
@UseGuards(JwtAuthGuard)
export class GamesController {
    constructor(private gameService: GamesService) { }

    @Get(":code")
    public async getGameSession(@Param('code') code: string) {
        return this.gameService.findByCode(code);
    }

    @Get(':code/progress/me')
    public async getMyProgress(@Param('code') code: string, @CurrentUser() user: UserDocument) {
        return this.gameService.getMyProgress(code, user._id.toString());
    }

    @Post()
    public async createGame(@CurrentUser() user: UserDocument) {
        return this.gameService.create(user._id.toString());
    }

    @Post(':code/players')
    public async joinGame(@Param('code') code: string, @CurrentUser() user: UserDocument) {
        return this.gameService.join(code, user._id.toString());
    }

    @Post(':code/progress')
    public async updatePlayerProgress(@Param('code') code: string, @CurrentUser() user: UserDocument, dto: SubmitProgress) {
        return this.gameService.submitProgress(code, user._id.toString(), dto.answers, dto.score);
    }

    @Patch(':code')
    public async updateGameSessionStatus(
        @Param('code') code: string,
        @Body() dto: UpdateGameSessionDto,
        @CurrentUser() user: UserDocument,
    ) {
        return this.gameService.updateGameSessionStatus(dto, code, user._id.toString());
    }
}