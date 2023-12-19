import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
const bcrypt = require('bcrypt');
import db from '../../db'
import { v4 as uuid } from 'uuid';
import { User } from './user.model';

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

		return (await db('users').insert(user).returning('*'))[0];
	}
}
