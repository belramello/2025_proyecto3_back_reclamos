// src/usuario/dto/respuesta-usuario.dto.ts

/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Exclude, Expose } from 'class-transformer';
import { IsString, IsOptional, IsEmail, IsNotEmpty } from 'class-validator';

@Exclude()
export class RespuestaUsuarioDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly id: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly nombreUsuario: string;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly rol: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly nombre?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly direccion?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly telefono?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly subarea?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly area?: string;

  constructor(partial: Partial<RespuestaUsuarioDto>) {
    Object.assign(this, partial);
  }
}
