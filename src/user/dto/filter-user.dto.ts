import { IsEnum, isDate, IsDateString, IsOptional, IsNumber, IsPositive, IsBooleanString, IsNumberString } from "class-validator";

export enum OrderBy {
  ranking,
	created_at,
	updated_at
}

export class FilterUserDto {

	@IsDateString()
	@IsOptional()
	date_from: Date;
	
	@IsOptional()
	@IsDateString()
	date_to: Date;

	@IsOptional()
	@IsNumberString()
	ranking_from: Number;
	
	@IsNumberString()
	@IsOptional()
	ranking_to: Number;

	@IsOptional()
	@IsBooleanString()
	deleted: Boolean;

	@IsOptional()
	@IsEnum(OrderBy)
	order_by: OrderBy;

	@IsOptional()
	@IsNumberString()
	users_on_page: number;
	
	@IsOptional()
	@IsNumberString()
	page_number: number;
}
