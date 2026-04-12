import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./jwt-auth.guard";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { CurrentUser } from "../common/decorators/user.decorator";
import type { UserDocument } from "../users/schemas/user.schema";

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto) { return this.authService.register(dto); }

    @Post('login')
    login(@Body() dto: LoginDto) { return this.authService.login(dto); }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    getMe(@CurrentUser() user: UserDocument) {
        return { id: user._id, email: user.email, displayName: user.displayName, role: user.role };
    }

}