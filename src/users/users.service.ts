import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { }

    async findAll() {
        return this.userModel.find().exec();
    }
}