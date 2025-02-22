import { HttpException, Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { CreateCompanyUseCase } from 'src/core/data/usecases/company/createCompany';
import { CompanyRepository } from 'src/infra/database/companyRepository.service';
import { GetAllCompaniesUseCase } from 'src/core/data/usecases/company/getAllCompanies';
import { GetCompanyUseCase } from 'src/core/data/usecases/company/getCompany';
import { UpdateCompanyProps } from 'src/core/data/interfaces/repositories/company';
import { DeleteCompanyUseCase } from 'src/core/data/usecases/company/deleteCompany';

@Injectable()
export class CompanyService {

  constructor(
    private readonly companyRepository: CompanyRepository
  ){}

  async create(createCompanyDto: CreateCompanyDto) {
    const usecase = new CreateCompanyUseCase(this.companyRepository)
    const res = await usecase.exec(createCompanyDto)
    if(res.left) throw new HttpException(res.left.message, res.left.statusCode)
    return res.right
  }

  async findAll(size: number, skip: number) {
    const usecase = new GetAllCompaniesUseCase(this.companyRepository)
    const res = await usecase.exec({
      size,
      skip
    })
    if(res.left) throw new HttpException(res.left.message, res.left.statusCode)
    return res.right
  }

  async findOne(id: string) {
    const usecase = new GetCompanyUseCase(this.companyRepository)
    const res = await usecase.exec({id: id})
    if(res.left) throw new HttpException(res.left.message, res.left.statusCode)
    return res.right
  }

  async update(id: string, updateCompanyDto: UpdateCompanyProps) {
    const usecase = new GetCompanyUseCase(this.companyRepository)
    const res = await usecase.exec({id: id, ...updateCompanyDto})
    if(res.left) throw new HttpException(res.left.message, res.left.statusCode)
    return res.right
  }

  async remove(id: string) {
    const usecase = new DeleteCompanyUseCase(this.companyRepository)
    const res = await usecase.exec({id})
    if(res.left) throw new HttpException(res.left.message, res.left.statusCode)
    return res.right
  }
}
