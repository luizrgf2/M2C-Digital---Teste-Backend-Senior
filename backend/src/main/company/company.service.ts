import { HttpException, Injectable, Request } from '@nestjs/common';
import { CreateCompanyDto } from './dto/createCompany.dto';
import { CreateCompanyUseCase } from 'src/core/data/usecases/company/createCompany';
import { CompanyRepository } from 'src/infra/database/companyRepository.service';
import { GetAllCompaniesUseCase } from 'src/core/data/usecases/company/getAllCompanies';
import { GetCompanyUseCase } from 'src/core/data/usecases/company/getCompany';
import { UpdateCompanyProps } from 'src/core/data/interfaces/repositories/company';
import { DeleteCompanyUseCase } from 'src/core/data/usecases/company/deleteCompany';
import { UpdateCompanyUseCase } from 'src/core/data/usecases/company/updateCompany';
import { ErrorBase } from 'src/core/shared/errorBase';



@Injectable()
export class CompanyService {

  constructor(
    private readonly companyRepository: CompanyRepository
  ){}

  private errorHandling(error?: ErrorBase) {
      if(error)
        throw new HttpException(error.message, error.statusCode)
  }
  
  async create(createCompanyDto: CreateCompanyDto, userId: string) {
    const usecase = new CreateCompanyUseCase(this.companyRepository)
    const res = await usecase.exec({...createCompanyDto, userId})
    this.errorHandling(res.left)
    return res.right
  }

  async findAll(size: number, skip: number, userId: string) {
    const usecase = new GetAllCompaniesUseCase(this.companyRepository)
    const res = await usecase.exec({
      size,
      skip,
      userId
    })
    this.errorHandling(res.left)
    return res.right
  }

  async findOne(id: string, userId: string) {
    const usecase = new GetCompanyUseCase(this.companyRepository)
    const res = await usecase.exec({id: id, userId})
    this.errorHandling(res.left)
    return res.right
  }

  async update(id: string, userId: string, updateCompanyDto: UpdateCompanyProps) {
    const usecase = new UpdateCompanyUseCase(this.companyRepository)
    const res = await usecase.exec({id: id, userId,...updateCompanyDto})
    this.errorHandling(res.left)
    return res.right
  }

  async remove(id: string, userId: string) {
    const usecase = new DeleteCompanyUseCase(this.companyRepository)
    const res = await usecase.exec({id, userId})
    this.errorHandling(res.left)
    return res.right
  }
}
