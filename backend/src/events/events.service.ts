import { BadRequestException, Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Event, EventDocument } from '../schemas/event.schema';
import { UserDocument } from '../schemas/user.schema';
import { GroupDocument } from 'src/schemas/group.schema';
import { GroupsService } from 'src/groups/groups.service';
import {
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common/exceptions';
import { InviteType } from 'src/schemas/invite.schema';
import { InvitesService } from 'src/invites/invites.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    private groupsService: GroupsService,
    private invitesService: InvitesService,
  ) {}

  async create(
    title: string,
    description: string,
    collaboratorsGroupNames: string[],
    admin: UserDocument,
  ) {
    const collaboratorsGroupDocuments: GroupDocument[] = [];
    for (const collaboratorGroupName of collaboratorsGroupNames) {
      const group = await this.groupsService.findOneByGroupName(
        collaboratorGroupName,
      );
      if (!group) {
        throw new BadRequestException(
          `Group Not Found: ${collaboratorGroupName}`,
        );
      }
      collaboratorsGroupDocuments.push(group);
    }

    const isUserGroupAdmin = collaboratorsGroupDocuments[0].admins.find((x) =>
      x.equals(admin._id),
    );
    if (!isUserGroupAdmin) {
      throw new UnauthorizedException();
    }

    const createdEvent = new this.eventModel({
      title: title,
      description: description,
      collaborators: [collaboratorsGroupDocuments[0]._id],
      createdBy: admin._id,
      created: Date.now(),
    });
    await createdEvent.save();

    for (let i = 1; i < collaboratorsGroupDocuments.length; i++) {
      this.invitesService.createInvite(
        InviteType.CollaboratorRequest,
        collaboratorsGroupDocuments[0]._id,
        collaboratorsGroupDocuments[i]._id,
        createdEvent._id,
      );
    }

    return createdEvent;
  }

  async findOne(id: number) {
    const event = await this.eventModel.findById(id);
    return event;
  }
}
