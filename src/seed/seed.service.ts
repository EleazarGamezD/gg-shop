import { Injectable } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { initialData } from './data/seed.data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService:ProductsService
  ){}
  async runSeed(){
    await this.insertNewProducts()
    return 'Seed Executed'
  }
  private async insertNewProducts(){
    await this.productService.deleteAllProducts()
    const products = initialData.products
    const insertPromises=[]
    products.forEach(products =>{
      insertPromises.push( this.productService.create(products))
    })
    await Promise.all(insertPromises)
    return true
  }
}
