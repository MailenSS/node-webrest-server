import { Router } from "express";
import { TodosController } from "./controller";
import { TodoDatasurceImpl } from "../../infrastructure/datasource/todo.datasource.impl";
import { TodoRepositoryImpl } from "../../infrastructure/repositories/todo.repository.impl";


export class TodoRoutes {

    static get routes(): Router {

       const router = Router();

       const datasource = new TodoDatasurceImpl();
       const todoRepository = new TodoRepositoryImpl( datasource );
       const todosController = new TodosController( todoRepository );

       router.get( '/', todosController.getTodos );
       router.get( '/:id', todosController.getTodoById );
       router.post( '/', todosController.createTodo );
       router.put( '/:id', todosController.updateTodo );
       router.delete( '/:id', todosController.deleteTodo );
       
       return router;
    }
}