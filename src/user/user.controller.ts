import { Body, Controller, Post, Put, Param, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { User, UserPaginated } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Post('/')
	async createUser(@Body() createUserDto: CreateUserDto): Promise<User>{
		return await this.userService.createUser(createUserDto);
	}

	@Put('/:id')
	async updateUser(@Body() updateUserDto: UpdateUserDto, @Param('id') id): Promise<User>{
		return await this.userService.updateUser(updateUserDto, id);
	}

	@Get('/:id')
	async getUserById(@Param('id') id): Promise<User>{
		return this.userService.getUserById(id);
	}

	@Get()
	async getAllUsers(@Query() filter: FilterUserDto): Promise<UserPaginated>{
		return await this.userService.getAllUsers(filter);
	}
}
