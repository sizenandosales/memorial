import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateMemorialDto {
  @IsString()
  @IsOptional()
  slug?: string;

  @IsString()
  @IsNotEmpty({ message: 'O nome completo é obrigatório.' })
  fullName!: string;

  @IsDateString(
    {},
    { message: 'A data de nascimento deve ser uma data válida.' },
  )
  @IsNotEmpty()
  birthDate!: string;

  @IsDateString(
    {},
    { message: 'A data de falecimento deve ser uma data válida.' },
  )
  @IsNotEmpty()
  deathDate!: string;

  @IsString()
  @IsNotEmpty()
  birthCity!: string;

  @IsString()
  @IsNotEmpty()
  deathCity!: string;

  @IsString()
  @IsNotEmpty()
  cemetery!: string;

  @IsString()
  @IsNotEmpty()
  biography!: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsString()
  @IsOptional()
  partnerId?: string;

  @IsString()
  @IsOptional()
  profilePicture?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  gallery?: string[];
}
