import { Model } from 'mongoose';
import { Package } from './package.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePackageDto } from './dto/create.package.dto';
import { ServiceService } from '../services/service.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class PackageService {
  constructor(
    @InjectModel(Package.name) private packageModel: Model<Package>,
    private serviceService: ServiceService,
  ) {}

  // this is to create a package with the services we pass in array in Json Obj
  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const { services: serviceNames, ...packageData } = createPackageDto;
  
    // get all the services from MongoDB (assuming you are using pagination)
    const { data: services } = await this.serviceService.findAll(); // Destructure to get the array of services
    const serviceIds = [];
  
    // Iterate over the provided service names and map them to the corresponding ObjectId
    for (const serviceName of serviceNames) {
      const service = services?.find(s => s.name === serviceName); // `services` should be an array now
      if (service) {
        serviceIds.push(service._id);
      } else {
        throw new NotFoundException(`Service with name ${serviceName} not found`);
      }
    }
  
    // Create and save the new package with the mapped service ObjectIds
    const newPackage = new this.packageModel({
      ...packageData,
      services: serviceIds,
    });
  
    return newPackage.save();
  }

  // this is to get all Packages from the 
  async findAll(page: number = 1, limit: number = 10): Promise<{ data: Package[], total: number }> {
    // Ensure page and limit are numbers
    page = Math.max(page, 1);
    limit = Math.max(limit, 1);

    const skip = (page - 1) * limit;
    //this is to getall count
    const total = await this.packageModel.countDocuments();

    //this is to get the packages with desired pagiantion and also with services
    const packages = await this.packageModel
      .find()
      .skip(skip)
      .limit(limit)
      .populate('services')
      .exec();

    return { data: packages, total };
  }

  // Get a package by ID with populated services
  async findOne(id: string): Promise<Package> {
    const packageData = await this.packageModel.findById(id).populate('services').exec();
    if (!packageData) 
      throw new NotFoundException(`Package having ID ${id} not found`);
    
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
        throw new NotFoundException(`Service having name ${serviceName} not found`);
      }
    }

    // Update the package having the mapped service ObjectIds
    const updatedPackage = await this.packageModel.findByIdAndUpdate(
      id,
      { ...updateData, services: serviceIds },
      { new: true },
    ).exec();

    if (!updatedPackage) 
      throw new NotFoundException(`Package having ID ${id} not found`);

    return updatedPackage;
  }


  // Deleting a packge by package id 
  async remove(id: string): Promise<Package> {
    const packageData = await this.packageModel.findByIdAndDelete(id).exec();
    if (!packageData) 
      throw new NotFoundException(`Package having ID ${id} not found`);
    
    return packageData;
  }
}
