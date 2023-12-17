import { Body, Controller, Get, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.model';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
	constructor(private userService: UserService) {}

	@Post('/create')
	async createUser(@Body() createUserDto: CreateUserDto): Promise<User>{
		return await this.userService.createUser(createUserDto);
	}
}
