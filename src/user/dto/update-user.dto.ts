import { IsEmail, IsNotEmpty, IsOptional, Length, IsPositive, IsDate, IsDateString } from "class-validator";

export class UpdateUserDto{

	@IsOptional()
	@IsNotEmpty()
	@Length(5)
	username: string;

	@IsOptional()
	first_name: string;

	@IsOptional()
	surname: string;

	@IsOptional()
	@IsNotEmpty()
	@IsEmail()
	e_mail: string;

	@IsOptional()
	@IsNotEmpty()
	@Length(8)
	password: string;

	@IsOptional()
	@IsNotEmpty()
	@IsPositive()
	ranking: number;

	@IsOptional()
	@IsDateString()
	deleted_at: Date;
}