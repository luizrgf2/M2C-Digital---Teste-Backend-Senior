import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, Request } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { UpdateCompanyDto } from './dto/updateCompany.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Post()
  create(@Body() createCompanyDto: CreateCompanyDto, @Request() req: ReqProps) {
    return this.companyService.create(createCompanyDto, req.user?.id as string);
  }

  @Get()
  findAll(@Query("size") size: string, @Query("skip") skip: string, @Request() req: ReqProps) {
    return this.companyService.findAll(+size, +skip, req.user?.id as string);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Request() req: ReqProps) {
    return this.companyService.findOne(id, req.user?.id as string);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto, @Request() req: ReqProps) {
    return this.companyService.update(id, req.user?.id as string, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Request() req: ReqProps) {
    return this.companyService.remove(id, req.user?.id as string);
  }
}
