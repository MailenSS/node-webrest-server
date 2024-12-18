import request from 'supertest';
import { testServer } from '../../test-server';
import { prisma } from '../../../src/data/postgres';


describe('Routes TODOS', () => {

    beforeAll( async() => {
        await testServer.start();
    });

    afterAll(() => {
        testServer.close();
    });

    beforeEach( async() => {
        // Limpiamos para que sea una prueba independiente
        await prisma.todo.deleteMany();
    });

    const todo1 = { text: 'Todo 1'};
    const todo2 = { text: 'Todo 2'};
    const todoId = -1;

    test('Should return TODOs api/todos', async() => {

        await prisma.todo.createMany({
            data: [ todo1, todo2 ]
        });

        // Asincrono - Callback
        const { body } = await request( testServer.app )
            .get('/api/todos')
            .expect(200);

        expect( body ).toBeInstanceOf( Array );
        expect( body.length ).toBe( 2 );
        expect( body[0].text ).toBe( todo1.text );
        expect( body[1].text ).toBe( todo2.text );
        // expect( body[0].completedAt ).toBeNull();
        expect( body[0].completedAt ).toBeUndefined();

    });


    test('Should return a TODO api/todos/:id', async() => {

        const todo = await prisma.todo.create({
            data: todo1
        });

        // Asincrono - Callback
        const { body } = await request( testServer.app )
            .get(`/api/todos/${ todo.id }`)
            .expect(200);

        expect( body ).toEqual({
            id: todo.id,
            text: todo.text,
            // completedAt: todo.completedAt,
        });

    });


    test('Should return a 404 NotFound - Get api/todos/:id', async() => {

        // Asincrono - Callback
        const { body } = await request( testServer.app )
            .get(`/api/todos/${ todoId }`)
            .expect(404);

        expect( body ).toEqual({
            error: `TODO with id ${ todoId } not found`
        });

    });


    test('Should return a new TODO api/todos/', async() => {

        // Asincrono - Callback
        const { body } = await request( testServer.app )
            .post(`/api/todos`)
            .send( todo1 )
            .expect( 201 ); //* Status de creacion

        expect( body ).toEqual({
            id: expect.any( Number ),
            text: todo1.text,
            // completedAt: null,
        });

    });


    test('Should return an error if text is not present - New TODO api/todos/', async() => {

        // Asincrono - Callback
        const { body } = await request( testServer.app )
            .post(`/api/todos`)
            .send({  })
            .expect( 400 );

        expect( body ).toEqual({ error: 'Text property is required' });

    });


    test('Should return an error if text is empty - New TODO api/todos/', async() => {

        // Asincrono - Callback
        const { body } = await request( testServer.app )
            .post(`/api/todos`)
            .send({ text: '' })
            .expect( 400 ); 

        expect( body ).toEqual({ error: 'Text property is required' });

    });


    test('Should return an updated TODO api/todos/:id', async() => {

        const todo = await prisma.todo.create({ data: todo1 });

        // Asincrono - Callback
        const { body } = await request( testServer.app )
            .put(`/api/todos/${ todo.id }`)
            .send({
                text: 'Update text',
                completedAt: '2023-10-31'
            })
            .expect( 200 ); 

        expect( body ).toEqual({
            id: expect.any( Number ),
            text: 'Update text',
            completedAt: '2023-10-31T00:00:00.000Z',
        });

    });


    test('Should return 404 if TODO not found - Update api/todos/:id', async() => {

        const { body } = await request( testServer.app )
            .put(`/api/todos/${ todoId }`)
            .send({
                text: 'Update text'
            })
            .expect( 404 ); 

        expect( body ).toEqual({ error: `TODO with id ${ todoId } not found` });

    });


    test('Should return an updated TODO with only date api/todos/:id', async() => {

        const todo = await prisma.todo.create({ data: todo1 });

        const { body } = await request( testServer.app )
            .put(`/api/todos/${ todo.id }`)
            .send({
                completedAt: '2023-10-31'
            })
            .expect( 200 ); 

        expect( body ).toEqual({
            id: expect.any( Number ),
            text: todo1.text,
            completedAt: '2023-10-31T00:00:00.000Z',
        });

    });


    test('Should return an deleted TODO api/todos/:id', async() => {

        const todo = await prisma.todo.create({ data: todo1 });

        const { body } = await request( testServer.app )
            .delete(`/api/todos/${ todo.id }`)
            .expect( 200 ); 

        expect( body ).toEqual({
            id: todo.id,
            text: todo.text,
        });

    });


    test('Should return 404 if TODO not found - Delete api/todos/:id', async() => {

        const { body } = await request( testServer.app )
            .delete(`/api/todos/${ todoId }`)
            .expect( 404 ); 

        expect( body ).toEqual({ error: `TODO with id ${ todoId } not found` });

    });
});