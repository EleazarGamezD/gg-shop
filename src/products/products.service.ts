import { BadGatewayException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import {Repository, ILike } from 'typeorm';
import {validate as isUUID } from 'uuid'
import { PaginationDto } from 'src/common/dtos/pagination.dto';



@Injectable()
export class ProductsService {
  // creamos variable privada logger  para manejar los errores en la consola de NEST 
  private readonly logger = new Logger('ProductService');
  
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>){}

  // creacion de producto  
   async create(createProductDto: CreateProductDto) {
   try{
      const product = 
          this.productRepository.create(createProductDto);
    await this.productRepository.save(product);
    return product;
    
     }
   catch(error){
    console.log(error)
    this.handleException(error)
   } 
  }

  async findAll(paginationDto:PaginationDto) {
    const {limit, offset} = paginationDto //desestructuramos el paginationDTO para indicar el Limit y Offset
    return this.productRepository.find({
      take:limit,
      skip:offset,
      // TODO: relaciones 
    })
    
  }

  async findOne(term: string) {
     let product:Product
    if(isUUID(term)){
      product = await this.productRepository.findOneBy({id:term})
    }
    else {
      const queryBuilder =  this.productRepository.createQueryBuilder()
      product = await queryBuilder
            //construimos el query donde comparamos los parametros que le vamos a enviar que en este caso puede ser slug o el title 
      .where(' UPPER(title) = :title or slug = :slug or = :tags' , 
       // indicamos que el valor de TERM se puede aplicar a title y al slug
          {
            title: term.toUpperCase(), 
            slug: term.toLowerCase(),
            tags: term
          }
        ).getOne() // con este indicamos que solo tome uno de estos dos valores 
    }
    
     if(!product)
     throw new NotFoundException(`Article whit id, name or no "${term}" not found `);
     return product;
  
   }
  

  async update(id: string, updateProductDto: UpdateProductDto) {

    const product = await this.productRepository.preload({
      id:id,
      ...updateProductDto
    })
    if(!product)
     throw new NotFoundException(`Article whit id, name or no "${id}" not found `);
try {     
     await this.productRepository.save(product)
}

   catch(error){
    console.log(error)
    this.handleException(error)
}
     return product;

  
  }

  async remove(id: string) {
    const product = await this.productRepository.findOneBy({id})
    await this.productRepository.remove(product)
    return `This product was Remove`
  }


  // creacion de metodo privado de manejo de errores 
  private handleException (error:any)  {
    if (error.code === '23505')
    throw new BadGatewayException(error.detail);
     
     
     this.logger.error(error)
      throw new InternalServerErrorException('Unexepected error, Check Server Logs')

  }
}
