import { IsString, IsArray,IsNotEmpty, IsMongoId } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;

  @IsArray()
  @IsMongoId({ each: true })//to validate each id in arrray is valid Mongo objectId
  services: string[];  //this is to accept array of ids for each services
}
