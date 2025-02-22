import { PartialType } from '@nestjs/mapped-types';
import { CreateCompanyDto } from './createCompany.dto';

export class UpdateCompanyDto extends PartialType(CreateCompanyDto) {}
