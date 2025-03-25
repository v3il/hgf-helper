import { UsersService } from './UsersService';
import { db } from '../db';

export const usersService = new UsersService(db);
