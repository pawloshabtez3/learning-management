import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { Role } from './dto';

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
    verify: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn((key: string) => {
      const config: Record<string, string> = {
        JWT_SECRET: 'test-secret',
        JWT_REFRESH_SECRET: 'test-refresh-secret',
        JWT_EXPIRES_IN: '15m',
        JWT_REFRESH_EXPIRES_IN: '7d',
      };
      return config[key];
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: ConfigService, useValue: mockConfigService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);

    jest.clearAllMocks();
  });


  describe('register', () => {
    const registerDto = {
      email: 'test@example.com',
      password: 'password123',
      name: 'Test User',
      role: Role.STUDENT,
    };

    it('should register a new user and return access token', async () => {
      const hashedPassword = await bcrypt.hash(registerDto.password, 10);
      const createdUser = {
        id: 'user-id',
        email: registerDto.email,
        password: hashedPassword,
        name: registerDto.name,
        role: registerDto.role,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockResolvedValue(createdUser);

      const result = await service.register(registerDto);

      expect(result.accessToken).toBe('mock-token');
      expect(result.user.email).toBe(registerDto.email);
      expect(result.user.name).toBe(registerDto.name);
      expect(result.user.role).toBe(registerDto.role);
      expect(mockPrismaService.user.create).toHaveBeenCalled();
    });

    it('should hash password before storing', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      mockPrismaService.user.create.mockImplementation(async ({ data }) => ({
        id: 'user-id',
        ...data,
      }));

      await service.register(registerDto);

      const createCall = mockPrismaService.user.create.mock.calls[0][0];
      const storedPassword = createCall.data.password;

      // Verify password was hashed (not stored as plain text)
      expect(storedPassword).not.toBe(registerDto.password);
      // Verify the hash is valid bcrypt
      const isValidHash = await bcrypt.compare(registerDto.password, storedPassword);
      expect(isValidHash).toBe(true);
    });

    it('should throw ConflictException if user already exists', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: 'existing-user',
        email: registerDto.email,
      });

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    const loginDto = {
      email: 'test@example.com',
      password: 'password123',
    };

    it('should return access token for valid credentials', async () => {
      const hashedPassword = await bcrypt.hash(loginDto.password, 10);
      const user = {
        id: 'user-id',
        email: loginDto.email,
        password: hashedPassword,
        name: 'Test User',
        role: Role.STUDENT,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      const result = await service.login(loginDto);

      expect(result.accessToken).toBe('mock-token');
      expect(result.user.email).toBe(loginDto.email);
      expect(mockJwtService.sign).toHaveBeenCalled();
    });

    it('should throw UnauthorizedException for non-existent user', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const hashedPassword = await bcrypt.hash('different-password', 10);
      const user = {
        id: 'user-id',
        email: loginDto.email,
        password: hashedPassword,
        name: 'Test User',
        role: Role.STUDENT,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(user);

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
    });
  });
});
