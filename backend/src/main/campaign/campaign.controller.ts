import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseInterceptors, UploadedFile, HttpException } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/createCampaign.dto';
import { UpdateCampaignDto } from './dto/updateCampaign.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Body() createCompanyDto: CreateCampaignDto) {
    if(file.mimetype !== "text/plain") throw new HttpException("O arquivo tem que ser em formato texto", 400)
    return this.campaignService.create(createCompanyDto, file.buffer.toString());
  }

  @Get()
  findAll(@Query("size") size: string, @Query("skip") skip: string) {
    return this.campaignService.findAll(+size, +skip);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignService.findOne(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCampaignDto) {
    return this.campaignService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignService.remove(id);
  }
}
