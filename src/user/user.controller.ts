import { Body, Controller, Post, Put, Param, Get } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

	@Get()
	async getAllUsers():Promise<User>{
		return await this.userService.getAllUsers();
	}
}
