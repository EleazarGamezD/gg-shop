import { Type } from "class-transformer";
import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class PaginationDto{
    @IsOptional()
    @IsPositive()
    @Min(1)
    @Type(() => Number) // transformamos el dato a un numero 
    limit?: number;

    @IsOptional()
    @IsNumber()
    @Min(0)
    @Type(() => Number) // transformamos el dato a un numero
    offset?: number;
}