import { BadGatewayException, Injectable, InternalServerErrorException, Logger, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto, LoginUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import e from 'express';
@Injectable()
export class AuthService {
  // creamos variable privada logger  para manejar los errores en la consola de NEST 
  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
  ) { }


  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto

      const user = this.userRepository.create({
        ...userData,
        //aplicamos el metodo bcrypt desestructurando la data y le indicamos que le de 10 vueltas 
        password: bcrypt.hashSync(password, 10)
      })
      await this.userRepository.save(user)
      delete user.password
      //retornar el JWT de acceso 
      return { ...user, token: this.getJwtToken({ id: user.id }) }
    }
    catch (error) {
      console.log(error)
      this.handleException(error)
    }

  }

  async login(loginUserDto: LoginUserDto) {
    try {
      const { password, email } = loginUserDto
      const user = await this.userRepository.findOne({
        where: { email },
        select: { email: true, password: true, id: true }  //!OJO
      })
      if (!user)
        throw new UnauthorizedException('Credentials are not valid (email) ')

      if (!bcrypt.compareSync(password, user.password))
        throw new UnauthorizedException('Credentials are not valid (password) ')

      const loggedUser = {
        id: user.id,
        email: user.email,
      }

      return {
        ...loggedUser,
        token: this.getJwtToken({ id: user.id })
      }
    } catch (error) {
      this.handleException(error)
    }

  }

  async checkAuthStatus(user: User) {
    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    }
  }

  //metodo privado para obtener y manejar el token
  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload)
    return token;
  }


  // creacion de metodo privado de manejo de errores
  private handleException(error: any): never {
    if (error.code === '23505') {
      console.log(error)
      throw new BadGatewayException(error.detail);
    }

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, Check Server Logs')

  }


}
