import { Optional } from '@nestjs/common';
import { IsString, IsArray,IsNotEmpty, IsMongoId } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @Optional()
  description: string;

  @IsArray()
  @IsString({ each: true }) // Each element should be a string (service name)
  services: string[];  // This will accept an array of service names
}
