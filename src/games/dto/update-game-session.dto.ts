import { IsIn } from 'class-validator';
import { GameStatus } from '../game-status';

export class UpdateGameSessionDto {
    @IsIn([GameStatus.ACTIVE, GameStatus.FINISHED]) status: GameStatus;
}