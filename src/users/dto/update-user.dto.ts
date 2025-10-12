import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// PartialType makes all fields optional and inherits validation decorators
export class UpdateUserDto extends PartialType(CreateUserDto) { }
