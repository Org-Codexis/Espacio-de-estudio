import { IsEmail, IsInt, IsNotEmpty, IsString, } from 'class-validator'

export class CreateUserDto {

    @IsString()
    @IsNotEmpty()
    fullName: string

    @IsEmail()
    email: string

    @IsString()
    @IsNotEmpty()
    password: string

    @IsInt()
    roleId: number

}