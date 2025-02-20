import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import {  SignInDto } from './dto/signIn.dto';
import { Public } from './authentication.guard';

@Controller('authentication')
export class AuthenticationController {
  constructor(private readonly authenticationService: AuthenticationService) {}

  @Public()
  @Post()
  async signIn(@Body() signIn: SignInDto) {
    return this.authenticationService.signIn(signIn)
  }
}
