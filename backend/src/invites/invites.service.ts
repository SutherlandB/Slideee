import { Model } from 'mongoose';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Invite, InviteDocument } from '../schemas/invite.schema';
import { SchemaFactory } from '@nestjs/mongoose';
import { InviteType } from '../schemas/invite.schema';
import * as mongoose from 'mongoose';
import { UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class InvitesService {
  constructor(
    @InjectModel(Invite.name) private inviteModel: Model<InviteDocument>,
  ) {}

  async createInvite(
    type: InviteType,
    sender: mongoose.Types.ObjectId,
    recipient: mongoose.Types.ObjectId,
    content?: mongoose.Types.ObjectId,
  ) {
    // TODO(reubenabu): Add check to avoid duplicate invites being created.
    const createdInvite = new this.inviteModel({
      type: type,
      sender: sender,
      recipient: recipient,
      content: content,
      created: new Date(),
    });
    await createdInvite.save();
    return createdInvite;
  }

  async acceptInvite(inviteId: string, user: UserDocument) {
    const invite = await this.inviteModel.findById(inviteId);
    if (!invite) {
      throw new NotFoundException('invite does not exist');
    }
    invite.accepted = true;
    await invite.save();
    return 'Success';
  }

  async declineInvite(inviteId: string, user: UserDocument) {
    const invite = await this.inviteModel.findById(inviteId);
    if (!invite) {
      throw new NotFoundException('Invite does not exist.');
    }
    await invite.deleteOne();
    return 'Success';
  }

  async removeInvite(inviteId: string, user: UserDocument) {
    const invite = await this.inviteModel.findById(inviteId);
    if (!invite) {
      throw new NotFoundException('Invite does not exist.');
    }
    await invite.deleteOne();
    return 'Success';
  }

  //this function will be used to find all invites where a group is a recepient
  /*async findInvites({ type, recipient } : { type?: InviteType, recipient?: string }) {
    const invites = await this.inviteModel.find({
      type: type,
      //sender: sender,
      recipient: recipient,
    });
    return invites;
  }*/
  async findInvites(type: InviteType, groupId: mongoose.Types.ObjectId) {
    const invites = await this.inviteModel.find({ type: type, recipient: groupId});
    return invites;
  }
}
