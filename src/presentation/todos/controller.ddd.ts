import { Request, Response } from "express";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { TodoRepository } from "../../domain";


// El ddd en el nombre es por el patron Domain Driven Design

export class TodosController {

    //* DI - Dependency injection
    constructor(
        private readonly todoRepository: TodoRepository
    ) {}

    //! Express recomienda no usar metodos asyncronos en esta parte
    public getTodos = async (req: Request, res: Response) => {
        const todos = await this.todoRepository.getAll();
        res.json( todos );
        return;
    }

    public getTodoById = async (req: Request, res: Response) => {
        
        // Conversion implicita
        const id = +req.params.id; 

        if ( isNaN( id ) ) {
            res.status(400).json( { error: `ID argument is not a number` } );
            return;
        }

        try {
            const todo = await this.todoRepository.findById( id );
            res.json( todo );
            return;

        } catch (error) {
            res.status(404).json( error );
            return;
        }
    }

    public createTodo = async (req: Request, res: Response) => {
        
        // const { text } = req.body;
        const [ error, createTodoDto ] = CreateTodoDto.create( req.body );

        if( error ) {
            res.status(400).json( { error } );
            return;
        }

        const newTodo = await this.todoRepository.create( createTodoDto! );

        res.json( newTodo );
        return;
    }

    public updateTodo = async (req: Request, res: Response) => {
        
        const id = +req.params.id; 
        const [ error, updateTodoDto ] = UpdateTodoDto.create({ ...req.body, id });

        if( error ) {
            res.status(400).json( { error } );
            return;
        }

        const todoUpdate = await this.todoRepository.updateById( updateTodoDto! );

        res.json( todoUpdate );
        return;
    }

    public deleteTodo = async (req: Request, res: Response) => {

        const id = +req.params.id; 

        const deletedTodo = await this.todoRepository.deleteById( id );
        res.json( deletedTodo );
        return;
    }
}

//          Comentario
//!         Warning
//todo      Algo pendiente