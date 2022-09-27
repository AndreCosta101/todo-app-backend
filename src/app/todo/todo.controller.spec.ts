import { Test, TestingModule } from '@nestjs/testing';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoEntity } from './entity/todo.entity';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';

const todoEntityList: TodoEntity[] = [
  new TodoEntity({ id: '1', task: 'task 1', isDone: 0 }),
  new TodoEntity({ id: '2', task: 'task 1', isDone: 0 }),
  new TodoEntity({ id: '3', task: 'task 1', isDone: 0 }),
];

const newTodoEntity: TodoEntity = new TodoEntity({
  task: 'new task',
  isDone: 0,
});

const updatedTodoEntity: TodoEntity = new TodoEntity({
  task: 'updated-task',
  isDone: 1,
});

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(todoEntityList),
            create: jest.fn().mockResolvedValue(newTodoEntity),
            findOneOrFail: jest.fn().mockResolvedValue(todoEntityList[0]),
            update: jest.fn().mockResolvedValue(updatedTodoEntity),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('index', () => {
    it('should return an array of todos', async () => {
      // Arrange
      // Act
      const result = await todoController.index();
      // Assert
      expect(result).toEqual(todoEntityList);
      expect(todoService.findAll).toHaveBeenCalled();
    });

    it('should throw an exception', () => {
      // Arrange
      jest
        .spyOn(todoService, 'findAll')
        .mockRejectedValueOnce(new Error('error'));

      //Assert
      expect(todoController.index()).rejects.toThrowError('error');
    });
  });

  describe('create', () => {
    it('should create a new todo', async () => {
      // Arrange
      const body: CreateTodoDto = {
        task: 'new task',
        isDone: 0,
      };
      // Act
      const result = await todoController.create(body);
      // Assert
      expect(result).toEqual(newTodoEntity);
      expect(todoService.create).toHaveBeenCalledWith(body);
    });

    it('should throw an exception', () => {
      // Arrange
      const body: CreateTodoDto = {
        task: 'new task',
        isDone: 0,
      };
      //Act
      jest
        .spyOn(todoService, 'create')
        .mockRejectedValueOnce(new Error('error'));
      //Assert
      expect(todoController.create(body)).rejects.toThrowError('error');
    });
  });

  describe('show', () => {
    it('should get a todo item successfully', async () => {
      // Arrange
      const id = '1';
      // Act
      const result = await todoController.show(id);
      // Assert
      expect(result).toEqual(todoEntityList[0]);
      expect(todoService.findOneOrFail).toHaveBeenCalledWith(id);
    });

    it('should throw an exception', () => {
      // Arrange
      const id = '1';
      //Act
      jest
        .spyOn(todoService, 'findOneOrFail')
        .mockRejectedValueOnce(new Error('error'));
      //Assert
      expect(todoController.show(id)).rejects.toThrowError('error');
    });
  });

  describe('update', () => {
    it('should update a todo item successfully', async () => {
      // Arrange
      const id = '1';
      const body: UpdateTodoDto = {
        task: 'updated-task',
        isDone: 1,
      };
      // Act
      const result = await todoController.update(id, body);

      // Assert
      expect(result).toEqual(updatedTodoEntity);
      expect(todoService.update).toHaveBeenCalledWith(id, body);
    });

    it('should throw an exception', () => {
      // Arrange
      const id = '1';
      const body: CreateTodoDto = {
        task: 'new task',
        isDone: 0,
      };
      //Act
      jest
        .spyOn(todoService, 'update')
        .mockRejectedValueOnce(new Error('error'));
      //Assert
      expect(todoController.update(id, body)).rejects.toThrowError();
    });
  });

  describe('destroy', () => {
    it('should delete a todo item successfully', async () => {
      // Arrange
      const id = '1';
      // Act
      const result = await todoController.destroy(id);
      // Assert
      expect(result).toBeUndefined();
      expect(todoService.deleteById).toHaveBeenCalledWith(id);
    });

    it('should throw an exception', () => {
      // Arrange
      const id = '1';
      //Act
      jest
        .spyOn(todoService, 'deleteById')
        .mockRejectedValueOnce(new Error('error'));
      //Assert
      expect(todoController.destroy(id)).rejects.toThrowError();
    });
  });
});
