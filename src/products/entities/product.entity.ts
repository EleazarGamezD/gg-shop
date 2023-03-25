import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from './product-image.entity';


//representación del obejto en base de datos 
@Entity({name:'products'}) // renombrando tabla 
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

    @OneToMany(
        ()=> ProductImage,
        (ProductImage) => ProductImage.product,
        {cascade:true,
         eager:true,
        }
    )
    images?:ProductImage[];
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
