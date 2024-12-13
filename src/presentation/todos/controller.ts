import { Request, Response } from "express"
import { prisma } from "../../data/postgres";
import { CreateTodoDto, UpdateTodoDto } from "../../domain/dtos";


export class TodosController {

    //* DI - Dependency injection
    constructor() {}

    public getTodos = async (req: Request, res: Response) => {
        
        const todos = await prisma.todo.findMany();
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

        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });
        
        ( todo )
            ? res.json( todo )
            : res.status(404).json( { error: `TODO with id ${ id } not found` } )

        return;
    }

    public createTodo = async (req: Request, res: Response) => {
        
        // const { text } = req.body;
        const [ error, createTodoDto ] = CreateTodoDto.create( req.body );

        if( error ) {
            res.status(400).json( { error } );
            return;
        }

        const newTodo = await prisma.todo.create({
            data: createTodoDto!
        })

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
        
        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });
        
        if ( !todo ) {
            res.status(404).json( { error: `TODO with id ${ id } not found` } );
            return;
        }

        // const { text, completedAt } = req.body;

        //! 

        const todoUpdate = await prisma.todo.update({
            where: { id: id },
            data: updateTodoDto!.values
        });

        res.json( todoUpdate );
        return;
    }

    public deleteTodo = async (req: Request, res: Response) => {

        const id = +req.params.id; 

        if ( isNaN( id ) ) {
            res.status(400).json( { error: `ID argument is not a number` } );
            return;
        }

        const todo = await prisma.todo.findUnique({
            where: {
                id: id
            }
        });
        
        if ( todo ) {
            const deleted = await prisma.todo.delete({
                where: {
                    id: id,
                }
            })
            res.json({ todo, deleted });
        } else {
            res.status(404).json( { error: `TODO with id ${ id } not found` } );
        }
        return;
    }
}