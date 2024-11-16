import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class UserRole extends Document{
    @Prop({required: true})
    userId: string

    @Prop({required:true})
    roleId: string

    @Prop({type: Boolean, default: true})
    isActive: Boolean

    
}

    export const UserRoleSchema = SchemaFactory.createForClass(UserRole);