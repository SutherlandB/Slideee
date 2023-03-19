import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { EditGroupDto } from './dto/edit-group.dto';
import { AuthenticatedGuard } from '../auth/authenticated.guard';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @UseGuards(AuthenticatedGuard)
  @Post('new')
  async createGroup(@Body() createGroupDto: CreateGroupDto, @Request() req) {
    const group = this.groupsService.createGroup(
      createGroupDto.groupName,
      createGroupDto.displayName,
      createGroupDto.isPrivate,
      req.user,
    );
    return group;
  }

  @Get(':groupName')
  async findOneByGroupName(@Param('groupName') groupName: string) {
    const group = await this.groupsService.findOneByGroupName(groupName);
    return group;
  }

  @Post(':groupName/delete')
  async deleteGroup(@Param('groupName') groupName: string, @Request() req) {
    const group = await this.groupsService.deleteGroup(groupName, req.user);
    return group;
  }

  @Post(':groupName/edit')
  async editGroup(
    @Param('groupName') groupName: string,
    @Body() editGroupDto: EditGroupDto,
    @Request() req,
  ) {
    const group = await this.groupsService.editGroup(
      groupName,
      editGroupDto.displayName,
      editGroupDto.isPrivate,
      req.user,
    );
    return group;
  }
}
