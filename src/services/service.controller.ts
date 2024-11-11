// Service controller is traffic constoller that controlls HTTP requests
import { Service } from './service.schema';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  findAll(): Promise<Service[]> {
    return this.serviceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Service> {
    return this.serviceService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateServiceDto: CreateServiceDto): Promise<Service> {
    return this.serviceService.update(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Service> {
    return this.serviceService.remove(id);
  }
}
