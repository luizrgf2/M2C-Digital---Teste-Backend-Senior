import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Put, UseInterceptors, UploadedFile, HttpException, Request } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/createCampaign.dto';
import { UpdateCampaignDto } from './dto/updateCampaign.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(@UploadedFile() file: Express.Multer.File, @Body() createCompanyDto: CreateCampaignDto, @Request() req: ReqProps) {
    if(file.mimetype !== "text/plain") throw new HttpException("O arquivo tem que ser em formato texto", 400)
    return this.campaignService.create(createCompanyDto, file.buffer.toString(), req.user?.id as string);
  }

  @Get(':companyId')
  findAll( @Param('companyId') companyId: string, @Query("size") size: string, @Query("skip") skip: string, @Request() req: ReqProps) {
    return this.campaignService.findAll(+size, +skip, companyId, req.user?.id as string);
  }

  @Get(':id/:companyId')
  findOne(@Param('id') id: string, @Param('companyId') companyId: string, @Request() req: ReqProps) {
    return this.campaignService.findOne(id, companyId, req.user?.id as string);
  }

  @Put(':id/:companyId')
  update(@Param('id') id: string, @Param('companyId') companyId: string, @Body() updateCompanyDto: UpdateCampaignDto, @Request() req: ReqProps) {
    return this.campaignService.update(id, companyId, req.user?.id as string, updateCompanyDto);
  }

  @Delete(':id/:companyId')
  remove(@Param('id') id: string, @Param('companyId') companyId: string, @Request() req: ReqProps) {
    return this.campaignService.remove(id, companyId, req.user?.id as string);
  }
}
