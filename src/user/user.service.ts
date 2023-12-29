import { BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
const bcrypt = require('bcrypt');
import db from '../../db'
import { v4 as uuid } from 'uuid';
import { User } from './user.model';
import { stringify } from 'querystring';
import { resourceUsage } from 'process';
import { PrivateKeyInput } from 'crypto';

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

		try {
			return (await db('users').where({id: id}).update(user).returning('*'))[0];
		} catch (error) {
			throw new BadRequestException();
		}
		
	}
	
	async getAllUsers(): Promise<User>{
		try {
			return await db('users');
		} catch (error) {
			throw new BadRequestException();
		}
	}

}

