import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { Package, PackageSchema } from './package.schema';
import { ServiceModule } from '../services/service.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Package.name, schema: PackageSchema }]),
    ServiceModule, //as we are using it in packages (each package has many services)
  ],
  providers: [PackageService],
  controllers: [PackageController],
})
export class PackageModule {}
