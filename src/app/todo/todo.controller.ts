import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  // Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BadRequestSwagger } from '../helpers/swagger/bad-request.swagger';
import { CreateTodoDto } from './dto/create-todo.dto';
// import { TodoQueryDto } from './dto/todo-query.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { CreateTodoSwagger } from './swagger/create-todo-swagger';
import { IndexTodoSwagger } from './swagger/index-todo-swagger';
import { TodoService } from './todo.service';

@Controller('api/v1/todos')
@ApiTags('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'List all todos' })
  @ApiResponse({
    status: 200,
    description: 'Return all todos',
    type: IndexTodoSwagger,
    isArray: true,
  })
  async index() {
    return await this.todoService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Create a todo' })
  @ApiResponse({
    status: 201,
    description: 'Successfully created.',
    type: CreateTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid Parameters',
    type: BadRequestSwagger,
  })
  async create(@Body() data: CreateTodoDto) {
    return await this.todoService.create(data);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Show a todo' })
  @ApiResponse({ status: 201, description: 'Successfully returned.' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.todoService.findOneOrFail(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a todo' })
  @ApiResponse({ status: 201, description: 'Successfully updated.' })
  @ApiResponse({
    status: 404,
    description: 'Task not found',
    type: BadRequestSwagger,
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() data: UpdateTodoDto,
  ) {
    return await this.todoService.update(id, data);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a todo' })
  @ApiResponse({ status: 204, description: 'Successfully deleted.' })
  @ApiResponse({ status: 404, description: 'Task not found' })
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.todoService.deleteById(id);
  }
}
