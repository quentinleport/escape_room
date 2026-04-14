import { IsArray, IsNumber, Max, Min } from 'class-validator';

export class SubmitProgress {
    @IsArray() answers: [];
    @IsNumber() @Min(0) @Max(100) score: number
}
