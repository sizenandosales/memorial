import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  visitorName!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;
}
