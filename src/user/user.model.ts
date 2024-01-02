export interface User {
	id: string;
	username: string;
	first_name?: string;
	surname?: string;
	e_mail: string;
	password: string;
	ranking: number;
	created_at: Date;
	updated_at: Date;
	deleted_at: Date;
}

export interface UserPaginated {
	page_number: number;
	users_on_page: number;
	total_pages: number;
	users: User[]
}