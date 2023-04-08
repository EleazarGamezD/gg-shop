import { Product } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne,  PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {
    
    @PrimaryGeneratedColumn('uuid')
    id:string;
    
    @Column('text', {unique:true})
    email:string;

    @Column('text',)
    password:string;

    @Column('text',)
    fullName:string;

    @Column('bool',{default:true})
    isActive: boolean;

    @Column('text',{
        array: true,
        default:['user'],
    })
    roles:string[];

    @ManyToOne(
    () => Product,
    (product) => product.id,
    { onDelete: 'CASCADE'} // se indica que borre la INFO que pertenecen al id padre 
)
    product: Product
}

