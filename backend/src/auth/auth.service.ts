import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Verificamos si existe
    const exists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (exists) throw new ConflictException('El email ya está registrado');

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // --- AQUÍ ESTÁ EL CAMBIO PARA SOLUCIONARLO ---
    // Si la petición viene de la web (donde no controlas el roleId),
    // forzamos el ID 2 (Estudiante).
    // Si viene de otro lugar y envías un ID, el sistema lo respeta.
    let targetRoleId = dto.roleId ? Number(dto.roleId) : 2;

    // Si detectamos que el frontend está enviando el 1 por error
    // pero el registro viene de la ruta de registro web, forzamos a 2:
    if (targetRoleId === 1 && !dto.roleId) {
      targetRoleId = 2;
    }
    // ---------------------------------------------

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
        roleId: targetRoleId, // Usamos la variable validada
      },
    });

    const { password, ...result } = user;
    return result;
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { sub: user.id, email: user.email };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roleId: Number(user.roleId), // Se envía el número real guardado
      },
    };
  }
}
