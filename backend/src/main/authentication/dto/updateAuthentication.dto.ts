import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthenticationDto } from './createAuthentication.dto';

export class UpdateAuthenticationDto extends PartialType(CreateAuthenticationDto) {}
