import { Request, Response } from "express"
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";
import { CreateTodo, CustomError, DeleteTodo, GetTodo, GetTodos, TodoRepository, UpdateTodo } from "../../domain";


export class TodosController {

    //* DI - Dependency injection
    constructor(
        private readonly todoRepository: TodoRepository
    ) {}

    private handleError = ( res: Response, error: unknown ) => {
        if ( error instanceof CustomError ) {
            res.status( error.statusCode ).json({ error: error.message });
            return;
        }

        res.status( 500 ).json({ error: 'Internal server error' });
    }

    // Sin metodos ronos en este nivel
    public getTodos = (req: Request, res: Response) => {
        
        new GetTodos( this.todoRepository )
            .execute()
            .then( todos => res.json( todos ))
            .catch( error => this.handleError( res, error ));
    }

    public getTodoById = (req: Request, res: Response) => {
        
        // Conversion implicita
        const id = +req.params.id; 

        if ( isNaN( id ) ) {
            res.status(400).json( { error: `ID argument is not a number` } );
            return;
        }

        new GetTodo( this.todoRepository )
            .execute( id )
            .then( todo => res.json( todo ))
            .catch( error => this.handleError( res, error ));
    }

    public createTodo = (req: Request, res: Response) => {
        
        // const { text } = req.body;
        const [ error, createTodoDto ] = CreateTodoDto.create( req.body );

        if( error ) {
            res.status(400).json( { error } );
            return;
        }

        new CreateTodo( this.todoRepository )
            .execute( createTodoDto! )
            .then( todo => res.status( 201 ).json( todo ))
            .catch( error => this.handleError( res, error ));
    }

    public updateTodo = (req: Request, res: Response) => {
        
        const id = +req.params.id; 
        const [ error, updateTodoDto ] = UpdateTodoDto.create({ ...req.body, id });

        if( error ) {
            res.status(400).json( { error } );
            return;
        }

        new UpdateTodo( this.todoRepository )
            .execute( updateTodoDto! )
            .then( todo => res.json( todo ))
            .catch( error => this.handleError( res, error ));
    }

    public deleteTodo = (req: Request, res: Response) => {

        const id = +req.params.id; 

        new DeleteTodo( this.todoRepository )
            .execute( id )
            .then( todo => res.json( todo ))
            .catch( error => this.handleError( res, error ));
    }
}

//          Comentario
//*         Comentario en negrita
//!         Warning
//todo      Algo pendiente
//?         Consultas