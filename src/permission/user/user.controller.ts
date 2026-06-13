import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionGuard } from '../guards/permission.guard';
import { Permission } from '../decorators/permission.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, SetRolesDto } from './dto/user.dto';

@Controller('permission/users')
@UseGuards(JwtAuthGuard, PermissionGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Permission('permission:user:index')
  async page(
    @Query('page') page?: number,
    @Query('pageSize') pageSize?: number,
    @Query('username') username?: string,
    @Query('status') status?: number,
  ) {
    return this.userService.page({ page, pageSize, username, status });
  }

  @Post()
  @Permission('permission:user:save')
  async create(@Body() dto: CreateUserDto, @CurrentUser() user: { id: number }) {
    return this.userService.create(dto, user.id);
  }

  @Put(':id')
  @Permission('permission:user:update')
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateUserDto,
    @CurrentUser() user: { id: number },
  ) {
    return this.userService.update(id, dto, user.id);
  }

  @Delete(':id')
  @Permission('permission:user:delete')
  async delete(@Param('id') id: number) {
    return this.userService.delete(id);
  }

  @Put(':id/password')
  @Permission('permission:user:password')
  async resetPassword(@Param('id') id: number) {
    return this.userService.resetPassword(id);
  }

  @Get(':id/roles')
  @Permission('permission:user:getRole')
  async getRoles(@Param('id') id: number) {
    return this.userService.getRoles(id);
  }

  @Put(':id/roles')
  @Permission('permission:user:setRole')
  async setRoles(@Param('id') id: number, @Body() dto: SetRolesDto) {
    return this.userService.setRoles(id, dto.roleIds);
  }
}
