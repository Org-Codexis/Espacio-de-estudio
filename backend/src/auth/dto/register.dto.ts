import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsNumber } from 'class-validator';

export class RegisterDto {
  @IsNotEmpty({ message: 'El nombre completo es obligatorio' })
  @IsString()
  fullName: string;

  @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
  @IsEmail({}, { message: 'El correo electrónico no es válido' })
  email: string;

  @IsNotEmpty({ message: 'La contraseña es obligatoria' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  // CAMBIO DEFINITIVO: Ahora aceptamos estrictamente un número entero
  @IsOptional()
  @IsNumber({}, { message: 'El roleId debe ser un número entero' })
  roleId?: number;
}