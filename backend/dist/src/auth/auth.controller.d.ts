import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from './dto';
import type { JwtPayload } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto, response: Response): Promise<import("./auth.service").AuthResponse>;
    login(loginDto: LoginDto, response: Response): Promise<import("./auth.service").AuthResponse>;
    refresh(request: Request, response: Response): Promise<{
        accessToken: string;
    } | {
        error: string;
    }>;
    logout(response: Response): {
        message: string;
    };
    getMe(user: JwtPayload): {
        id: string;
        email: string;
        role: string;
    };
    private setRefreshTokenCookie;
}
