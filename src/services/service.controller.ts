// Service controller is traffic constoller that controlls HTTP requests
import { Service } from './service.schema';
import { ServiceService } from './service.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { Controller, Get, Post, Body, Param, Delete, Put, Query, Patch } from '@nestjs/common';

@Controller('services')
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  @Post()
  create(@Body() createServiceDto: CreateServiceDto): Promise<Service> {
    return this.serviceService.create(createServiceDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,    
    @Query('limit') limit: number = 10,  
  ): Promise<{ data: Service[], total: number }> {
    return this.serviceService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Service> {
    return this.serviceService.findOne(id);
  }

  @Patch(':id')
  updatePartial(
    @Param('id') id: string, 
    @Body() updateServiceDto: CreateServiceDto
  ): Promise<Service> {
    return this.serviceService.updatePartial(id, updateServiceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Service> {
    return this.serviceService.remove(id);
  }
}
