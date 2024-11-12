import { Controller, Get, Post, Body, Param, Delete, Patch, Query } from '@nestjs/common';
import { PackageService } from './package.service';
import { CreatePackageDto } from './dto/create.package.dto';
import { Package } from './package.schema';

@Controller('packages')
export class PackageController {
  constructor(private readonly packageService: PackageService) {}

  @Post()
  create(@Body() createPackageDto: CreatePackageDto): Promise<Package> {
    return this.packageService.create(createPackageDto);
  }

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ): Promise<{ data: Package[], total: number }> {
    return this.packageService.findAll(page, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Package> {
    return this.packageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePackageDto: CreatePackageDto): Promise<Package> {
    return this.packageService.update(id, updatePackageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Package> {
    return this.packageService.remove(id);
  }
}
