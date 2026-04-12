import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from "./dto/register.dto";
import { UsersService } from "../users/users.service";
import { LoginDto } from "./dto/login.dto";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    async register(data: RegisterDto) {
        const userAlreadyExists = await this.usersService.findByEmail(data.email);
        if (userAlreadyExists) {
            throw new ConflictException({
                statusCode: 409,
                error: 'Conflict',
                message: 'An account with this email already exists',
                field: 'email',
            });
        }
        const passwordHash = await bcrypt.hash(data.password, 10);
        const user = await this.usersService.create(data.email, passwordHash, data.displayName);
        const token = this.jwtService.sign({ sub: user._id.toString(), email: user.email });
        return { token, user: { id: user._id, email: user.email, displayName: user.displayName } }
    }

    async login(dto: LoginDto) {
        const user = await this.usersService.findByEmail(dto.email);
        if (!user) throw new UnauthorizedException('Invalid credentials');
        const valid = await bcrypt.compare(dto.password, user.passwordHash);
        if (!valid) throw new UnauthorizedException('Invalid credentials');
        const token = this.jwtService.sign({ sub: user._id.toString(), email: user.email });
        return { token, user: { id: user._id, email: user.email, displayName: user.displayName } };
    }
}