import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { Role } from "src/roles/entities/role.entity";

@Schema({timestamps: true})
export class User extends Document {
    @Prop({required: true})
    username: string

    @Prop({required: true})
    password: string;

    @Prop({type: [String]})
    roles: string[]

    @Prop({type: Boolean, default: true})
    isActive: Boolean
    


}

export const UserSchema = SchemaFactory.createForClass(User);