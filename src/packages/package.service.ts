import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Package } from './package.schema';
import { CreatePackageDto } from './dto/create.package.dto';
import { ServiceService } from '../services/service.service';

@Injectable()
export class PackageService {
  constructor(
    @InjectModel(Package.name) private packageModel: Model<Package>,
    private serviceService: ServiceService,
  ) {}

  // this is to create a package with the services we pass in array in Json Obj
  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const { services: serviceNames, ...packageData } = createPackageDto;

    // fetch all the services fom MongiDb
    const services = await this.serviceService.findAll(); 
    const serviceIds = [];

    // Iterate over the provided service names and map them to the corresponding ObjectId
    for (const serviceName of serviceNames) {
      const service = services.find(s => s.name === serviceName); 
      if (service) 
        serviceIds.push(service._id);
       else 
        throw new NotFoundException(`Service with name ${serviceName} not found`);
      
    }
    // Create and save the new package with the mapped service ObjectIds
    const newPackage = new this.packageModel({
      ...packageData,
      services: serviceIds
    });

    return newPackage.save();
  }

  // this is to get all Packages from the 
  async findAll(): Promise<Package[]> {
    return this.packageModel.find().populate('services').exec();
  }

  // Get a package by ID with populated services
  async findOne(id: string): Promise<Package> {
    const packageData = await this.packageModel.findById(id).populate('services').exec();
    if (!packageData) 
      throw new NotFoundException(`Package with ID ${id} not found`);
    
    return packageData;
  }

  // Update a package by ID
  async update(id: string, updatePackageDto: CreatePackageDto): Promise<Package> {
    const { services: serviceNames, ...updateData } = updatePackageDto;

    const services = await this.serviceService.findAll();
    const serviceIds = [];

    // Iterate over the provided service names and map them to the corresponding ObjectId
    for (const serviceName of serviceNames) {
      const service = services.find(s => s.name === serviceName);
      if (service) {
        serviceIds.push(service._id);
      } else {
        throw new NotFoundException(`Service with name ${serviceName} not found`);
      }
    }

    // Update the package with the mapped service ObjectIds
    const updatedPackage = await this.packageModel.findByIdAndUpdate(
      id,
      { ...updateData, services: serviceIds },
      { new: true },
    ).exec();

    if (!updatedPackage) 
      throw new NotFoundException(`Package with ID ${id} not found`);

    return updatedPackage;
  }


  // Deleting a packge by package id 
  async remove(id: string): Promise<Package> {
    const packageData = await this.packageModel.findByIdAndDelete(id).exec();
    if (!packageData) 
      throw new NotFoundException(`Package with ID ${id} not found`);
    
    return packageData;
  }
}
