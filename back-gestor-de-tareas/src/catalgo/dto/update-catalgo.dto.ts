import { PartialType } from '@nestjs/mapped-types';
import { CreateCatalogoDto } from './create-catalgo.dto';

export class UpdateCatalogoDto extends PartialType(CreateCatalogoDto) {}
