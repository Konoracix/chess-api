import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
const bcrypt = require('bcrypt');
import db from '../../db'
import { v4 as uuid } from 'uuid';
import { User, UserPaginated } from './user.model';

@Injectable()
export class UserService {

	async createUser(user): Promise<User>{
		
		const usersWithSameEMail = await db('users').where({
			e_mail: user.e_mail,
			deleted_at: null
		})

		if(usersWithSameEMail.length){
			throw new HttpException(`User with e-mail: '${user.e_mail}', already exists in the database.`, HttpStatus.CONFLICT);
		}

		const hashedPassword = await new Promise((resolve, reject) => {
			bcrypt.hash(user.password, 10, (err, hash) => {
				if (err) reject(err)
				resolve(hash)
			});
		})
		
		user.password = hashedPassword;
		user.id = uuid();
		
		try {
			return (await db('users').insert(user).returning('*'))[0];
		} catch (error) {
			throw new BadRequestException();
		}

	}

	async updateUser(user, id): Promise<User>{

		if(Object.keys(user).length === 0){
			throw new HttpException('Request body should not be empty', HttpStatus.BAD_REQUEST)
		}
		
		try {
			await db('users').where({id: id})
		} catch (error) {
			throw new NotFoundException();
		}

		if(user.password){
			user.password = await new Promise((resolve, reject) => {
				bcrypt.hash(user.password, 10, (err, hash) => {
					if (err) reject(err)
					resolve(hash)
				});
			})
		}
		user.updated_at = new Date;
		try {
			return (await db('users').where({id: id}).update(user).returning('*'))[0];
		} catch (error) {
			throw new BadRequestException();
		}
		
	}
	
	async getUserById(id, deleted): Promise<User>{
		let user;
		try {
			user = await db('users').where(builder => {
				builder.andWhere("id", id)
				if(deleted != 'true'){
					builder.andWhere("deleted_at", null)
				}
			})

			if(user.length == 0){
				throw new NotFoundException();
			}
			return user[0];
		} catch (error) {
			if(error.response?.statusCode == 404) throw new NotFoundException();
			throw new BadRequestException();
		}
	}

	async getAllUsers(filter): Promise<UserPaginated>{

		try {
			let totalNumberOfUsers = (await db('users').where(builder => {
				let isDeleted:Boolean = false;
				for(let key in filter){
					switch (key) {
						case 'date_from':
							 builder.andWhere("created_at", ">", filter[key])
							break;
						case 'date_to':
							builder.andWhere("created_at", "<", filter[key])
							break;
						case 'ranking_from':
							builder.andWhere("ranking", ">", filter[key])
							break;
						case 'ranking_to':
							builder.andWhere("ranking", "<", filter[key])
							break;
						case 'deleted':
							isDeleted = filter[key].toLowerCase().trim() === 'true';
							break;
						default:
							break;
					}
				}
				if(isDeleted == false){
					builder.andWhere("deleted_at", null);
				}
			}).count('*'))[0].count;
			
			let numberOfUsersOnPage = filter.users_on_page ? parseInt(filter.users_on_page) : 10;
			let pageNumber = filter.page_number ? parseInt(filter.page_number) : 1;

			let users = await db('users').where(builder => {
				let isDeleted:Boolean = false;
				for(let key in filter){
					switch (key) {
						case 'date_from':
							 builder.andWhere("created_at", ">", filter[key])
							break;
						case 'date_to':
							builder.andWhere("created_at", "<", filter[key])
							break;
						case 'ranking_from':
							builder.andWhere("ranking", ">", filter[key])
							break;
						case 'ranking_to':
							builder.andWhere("ranking", "<", filter[key])
							break;
						case 'deleted':
							isDeleted = filter[key].toLowerCase().trim() === 'true';
							break;
						default:
							break;
					}
				}
				if(isDeleted == false){
					builder.andWhere("deleted_at", null);
				}
			})
			.orderBy(filter.order_by ? filter.order_by : 'created_at').offset(numberOfUsersOnPage*(pageNumber-1)).limit(numberOfUsersOnPage)
			return {
				page_number: pageNumber,
				users_on_page: numberOfUsersOnPage,
				total_pages: Math.ceil(totalNumberOfUsers/numberOfUsersOnPage),
				users: users
			}
		} catch (error) {
			throw new BadRequestException();
		}
	}

	async deleteUser(id): Promise<User>{
		try {
	
			let now = new Date;
			
			return (await db('users').where({id: id}).update({
				updated_at: now,
				deleted_at: now,
			}).returning('*'))[0];
	
		} catch (error) {
			throw new BadRequestException();	
		}
	}
}
