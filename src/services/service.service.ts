//all of the crud logic is here
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Service } from './service.schema';
import { CreateServiceDto } from './dto/create-service.dto';

@Injectable()
export class ServiceService {
  constructor(@InjectModel(Service.name) private serviceModel: Model<Service>) { }

  //to handle create service
  async create(CreateServiceDto: CreateServiceDto): Promise<Service> {
    const newCreatedService = new this.serviceModel(CreateServiceDto)
    return newCreatedService.save();
  }

  //this will help us to get all records for services
  async findAll(page: number = 1, limit: number = 10): Promise<{
    [x: string]: any; data: Service[], total: number
  }> {
    page = Math.max(page, 1);
    limit = limit === undefined ? Infinity : Math.max(limit, 1); // If limit is undefines, set it to Infinity to fetch all records

    let total: number;
    let services: Service[];

    if (limit === Infinity) {
      services = await this.serviceModel.find().exec();
      total = services.length;
    } else {
      // Get the total count of services
      total = await this.serviceModel.countDocuments();

      // Fetch the paginated services
      const skip = (page - 1) * limit; // Calculate how many to skip
      services = await this.serviceModel
        .find()
        .skip(skip)
        .limit(limit)
        .exec();
    }

    return { data: services, total };
  }


  //this will help us to fetch service by Id
  async findOne(id: string): Promise<Service> {
    const getServiceById = await this.serviceModel.findById(id).exec();
    if (!getServiceById)
      throw new NotFoundException(`Service ${id} not Found`)

    return getServiceById
  }

  //this will help to update a specific record by id
  async updatePartial(id: string, updateServiceDto: CreateServiceDto): Promise<Service> {
    const updatedService = await this.serviceModel.findByIdAndUpdate(
      id,
      updateServiceDto,  // Pass the fields that should be updated
      { new: true } // Return the updated document
    );
    return updatedService;
  }

  //To delete a record by ID
  async remove(id: string): Promise<Service> {
    const deleteServiceById = await this.serviceModel.findByIdAndDelete(id).exec();
    if (!deleteServiceById)
      throw new NotFoundException(`Service with ID ${id} not found`);

    return deleteServiceById;
  }
}