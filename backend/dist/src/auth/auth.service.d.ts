import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto, LoginDto } from './dto';
export interface JwtPayload {
    sub: string;
    email: string;
    role: string;
}
export interface AuthResponse {
    accessToken: string;
    user: {
        id: string;
        email: string;
        name: string;
        role: string;
    };
}
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<AuthResponse>;
    login(loginDto: LoginDto): Promise<AuthResponse>;
    refreshToken(userId: string): Promise<{
        accessToken: string;
    }>;
    private generateAccessToken;
    generateRefreshToken(user: {
        id: string;
        email: string;
        role: string;
    }): string;
    validateRefreshToken(token: string): Promise<JwtPayload>;
}
