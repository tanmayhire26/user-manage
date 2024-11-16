import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";


@Schema({timestamps: true})
export class Role extends Document {
    @Prop({required: true})
    name: string

    @Prop({type: [String]})
    permissions: string[]

    @Prop({type: Boolean, default: true})
    isActive: Boolean
}
    export const RoleSchema = SchemaFactory.createForClass(Role);