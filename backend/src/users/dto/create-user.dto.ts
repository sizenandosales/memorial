import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'; // Importe estes dois

export class CreateUserDto {
  @ApiProperty({ description: 'Nome completo do usuário' })
  @IsString({ message: 'O nome deve ser um texto válido' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name!: string;

  @ApiProperty({ description: 'Endereço de e-mail do usuário' })
  @IsEmail({}, { message: 'O e-mail fornecido não é válido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email!: string;

  @ApiProperty({ description: 'Senha (mínimo 6 caracteres)', minLength: 6 })
  @IsString()
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password!: string;

  @ApiProperty({ description: 'CPF ou CNPJ do usuário' })
  @IsString({ message: 'O documento deve ser um texto válido' })
  @IsNotEmpty({ message: 'O documento (CPF ou CNPJ) é obrigatório' })
  document!: string;

  @ApiPropertyOptional({ description: 'Cargo ou permissão do usuário' })
  @IsString()
  @IsOptional()
  role?: string;

  @ApiPropertyOptional({ description: 'Telefone de contato' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ description: 'Código de Endereçamento Postal (CEP)' })
  @IsString()
  @IsNotEmpty({ message: 'O CEP é obrigatório' })
  cep!: string;

  @ApiProperty({ description: 'Nome da rua ou logradouro' })
  @IsString()
  @IsNotEmpty({ message: 'O logradouro é obrigatório' })
  logradouro!: string;

  @ApiProperty({ description: 'Número do endereço' })
  @IsString()
  @IsNotEmpty({ message: 'O número é obrigatório' })
  numero!: string;

  @ApiPropertyOptional({ description: 'Complemento (opcional)' })
  @IsString()
  @IsOptional()
  complemento?: string;

  @ApiProperty({ description: 'Bairro' })
  @IsString()
  @IsNotEmpty({ message: 'O bairro é obrigatório' })
  bairro!: string;

  @ApiProperty({ description: 'Cidade' })
  @IsString()
  @IsNotEmpty({ message: 'A cidade é obrigatória' })
  cidade!: string;

  @ApiProperty({ description: 'Unidade Federativa (UF)' })
  @IsString()
  @IsNotEmpty({ message: 'O estado (UF) é obrigatório' })
  uf!: string;
}
