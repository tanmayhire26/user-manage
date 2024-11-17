import { IsArray, IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class AssignRolesDto {
  @IsArray()
  @IsNotEmpty()
  roleIds: Types.ObjectId[];
} 