import { IsUrl, IsNotEmpty } from 'class-validator';

export class AddGalleryImageDto {
  @IsUrl()
  @IsNotEmpty()
  imageUrl!: string;
}
