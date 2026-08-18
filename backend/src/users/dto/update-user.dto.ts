import { PartialType } from '@nestjs/swagger'; // 👈 Mude a origem aqui
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {}
