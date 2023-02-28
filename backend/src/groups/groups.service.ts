import { Model } from 'mongoose';
import { Injectable, BadRequestException} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Group, GroupDocument } from '../schemas/group.schema';
import { User, UserDocument } from '../schemas/user.schema';
import { ConsoleWriter } from 'istanbul-lib-report';


@Injectable()
export class GroupsService {
  constructor(@InjectModel(Group.name) private groupModel: Model<GroupDocument>) {}

  async createGroup(groupName: string, displayName: string, isPrivate: Boolean, owner: User) {
    let group = await this.findOneByGroupName(groupName);
    if (group) {
      throw new BadRequestException();
    }

    const createdGroup = new this.groupModel({
      groupName: groupName,
      displayName: displayName,
      isPrivate: isPrivate,
      Owner: owner,
      Admins: [owner],
    });

    await createdGroup.save();

    return createdGroup;
  }

  async findOneByGroupName(groupName: string) {
    let group = await this.groupModel.findOne({
      groupName: groupName,
    });
    return group;
  }

  async editGroup(groupName: string, displayName: string, isPrivate: Boolean, user: UserDocument) {
    let group = await this.groupModel.findOne({
      groupName: groupName,
    });

    if (!group) {
      throw new BadRequestException();
    }

    if(!group.Admins.find(x => x.equals(user._id))){
     throw new BadRequestException();
    }

    group.displayName = displayName;
    group.isPrivate = isPrivate;
    await group.save();

    return group;
  }

  async deleteGroup(groupName: string, owner: UserDocument) {
    let group = await this.groupModel.findOne({
      groupName: groupName,
    });
    if (!group) {
      throw new BadRequestException();
    }
    if(!group.Owner.equals(owner._id)){
       throw new BadRequestException();
    }
    await group.deleteOne();
    return 'Success';
  }
  
}
