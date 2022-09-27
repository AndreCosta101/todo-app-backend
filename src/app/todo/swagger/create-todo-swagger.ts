import { OmitType } from '@nestjs/swagger';
import { TodoEntity } from '../entity/todo.entity';

export class CreateTodoSwagger extends OmitType(TodoEntity, [
	'createdAt',
	'updatedAt',
	'deletedAt',
]) {}
