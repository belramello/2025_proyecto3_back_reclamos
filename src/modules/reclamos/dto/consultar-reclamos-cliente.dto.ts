import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum OrdenamientoReclamosEnum {
  FECHA_ASC = 'fechaCreacion',
  FECHA_DESC = '-fechaCreacion',
  ESTADO_ASC = 'estado',
  ESTADO_DESC = '-estado',
  AREA_ASC = 'areaPrincipal',
  AREA_DESC = '-areaPrincipal',
}

export class ConsultarReclamosClienteDto {
  @IsOptional()
  @IsString()
  tipoReclamoId?: string;

  @IsOptional()
  @IsString()
  proyectoId?: string; 

  @IsOptional()
  @IsString()
  estado?: string; 

  @IsOptional()
  @IsString()
  areaPrincipal?: string; 

  @IsOptional()
  @IsEnum(OrdenamientoReclamosEnum)
  ordenarPor?: OrdenamientoReclamosEnum =
    OrdenamientoReclamosEnum.FECHA_DESC;

  @IsOptional()
  @IsString()
  busqueda?: string; 
}
