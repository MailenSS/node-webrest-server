import { prisma } from "../../data/postgres";
import { CreateTodoDto, CustomError, TodoDatasource, TodoEntity, UpdateTodoDto } from "../../domain";


export class TodoDatasurceImpl implements TodoDatasource {

    async create(createTodoDto: CreateTodoDto): Promise<TodoEntity> {
        const newTodo = await prisma.todo.create({
            data: createTodoDto!
        });

        return TodoEntity.fromObject( newTodo );
    }
    
    async getAll(): Promise<TodoEntity[]> {
        const todos = await prisma.todo.findMany();
        return todos.map( TodoEntity.fromObject );
    }

    async findById(id: number): Promise<TodoEntity> {
        const todo = await prisma.todo.findUnique({
            where: { id: id }
        });

        if ( !todo ) throw new CustomError(`TODO with id ${ id } not found`, 404);

        return TodoEntity.fromObject( todo );
    }

    async updateById(updateTodoDto: UpdateTodoDto): Promise<TodoEntity> {
        await this.findById( updateTodoDto.id );

        const todoUpdate = await prisma.todo.update({
            where: { id: updateTodoDto.id },
            data: updateTodoDto!.values
        });

        return TodoEntity.fromObject( todoUpdate );
    }

    async deleteById( id: number ): Promise<TodoEntity> {
        await this.findById( id );

        const deletedTodo = await prisma.todo.delete({
            where: { id: id }
        });

        return TodoEntity.fromObject( deletedTodo );
    }
}