import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductImage } from './entities/product-image.entity';

import { User } from 'src/auth/entities/user.entity';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    TypeOrmModule.forFeature([Product,ProductImage]) // se le indica las entities (tablas y estructas ) para que sean leidas en el proyecto.
  ],
  exports:[ProductsService,TypeOrmModule]
})
export class ProductsModule {}
