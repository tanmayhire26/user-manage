import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({timestamps: true})
export class Permission extends Document{
    @Prop({required: true})
    name: string;

    
}

    export const PermissionSchema = SchemaFactory.createForClass(Permission);