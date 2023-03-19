import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { CreateProductDto } from '../dto/create-product.dto';


//representación del obejto en base de datos 
@Entity()
export class Product {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column('text', { unique:true })
    title: string;
    
    @Column('float',{default:0})
    price:number;
    
    @Column({ type: 'text',  nullable:true})
    description: string;
    
    @Column('text',{unique: true})
    slug?: string;
    
    @Column('int',{default:0})
    stock: number;
    
    @Column('text',{array: true})
    sizes: string[];
    
    @Column('text',)
    gender: string;
    
    @Column('text',{
        array: true,
        default:[],
    })
    tags:string[]; 
        
//verificamos si el SLUG existe y que cumpla las reglas 
 @BeforeInsert()
    checkSlugInsert(){
        // verificamos si existe el SLUG 
        if(!this.slug) {
        this.slug = this.title
       }
        //de no existir cambiamos las letras a minúsculas y eliminamos los espacios 
        //y quitamos los apostrofes 
       this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ','_')
        .replaceAll("'",'')
        .replaceAll("´",'')
       }
    
    @BeforeUpdate()
     checkSlugUpdate(){
        // cambiamos las letras a minúsculas y eliminamos los espacios 
        //y quitamos los apostrofes 
       this.slug = this.slug
        .toLowerCase()
        .replaceAll(' ','_')
        .replaceAll("'",'')
        .replaceAll("´",'')
       }
}
