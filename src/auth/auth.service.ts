import { BadGatewayException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  // creamos variable privada logger  para manejar los errores en la consola de NEST 
  private readonly logger = new Logger('ProductService');

  constructor(
 @InjectRepository(User)
    private readonly userRepository: Repository<User>){}
  

  async create(createUserDto:CreateUserDto) {
    try{

      const user = this.userRepository.create(createUserDto)
      await this.userRepository.save(user)
      return user

    }
    catch(error){
      console.log(error)
      this.handleException(error)
    }
    
  }


// creacion de metodo privado de manejo de errores 
  private handleException (error:any):never  {
    if (error.code === '23505')
    console.log (error)
    throw new BadGatewayException(error.detail);
     
     
     this.logger.error(error)
      throw new InternalServerErrorException('Unexepected error, Check Server Logs')

  }


}
