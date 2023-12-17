import { IsEmail, IsNotEmpty, IsOptional, Length } from "class-validator";

export class CreateUserDto{
	@IsNotEmpty()
	@Length(5)
	username: string;

	@IsOptional()
	@IsNotEmpty()
	first_name: string;

	@IsNotEmpty()
	@IsOptional()
	surname: string;

	@IsNotEmpty()
	@IsEmail()
	e_mail: string;

	@IsNotEmpty()
	@Length(8)
	password: string;
}