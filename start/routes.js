'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

const Database = use('Database')

// root route and basics infos  
Route.get('/', async () => {
  return {
    author: "Witor S. Oliveira <contato@witorsilva.com>",
    objetivo: "Api para permitir que professores controlem a alocação de salas de aulas e alunos"
  }
})

/**
 * SALA ONLINE (online room)
 */

// students
Route.resource('students', 'StudentController').except(['update', 'show', 'destroy'])
Route.get('students/:registration_id', 'StudentController.show')
Route.put('students/:registration_id', 'StudentController.update')
Route.delete('students/:registration_id', 'StudentController.destroy')

// teachers
Route.resource('teachers', 'TeacherController').except(['update', 'show', 'destroy'])
Route.get('teachers/:registration_id', 'TeacherController.show')
Route.put('teachers/:registration_id', 'TeacherController.update')
Route.delete('teachers/:registration_id', 'TeacherController.destroy')

// classroom
Route.resource('classrooms', 'ClassroomController').except(['update', 'show', 'destroy'])
Route.get('classrooms/:number', 'ClassroomController.show')
Route.put('classrooms/:number', 'ClassroomController.update')
Route.delete('classrooms/:number', 'ClassroomController.destroy')

// student classroom
Route.post('studentclassroom/allocate', 'StudentClassroomController.allocateStudent')
Route.get('studentclassroom/allocate/:registration_id', 'StudentClassroomController.getAllocateStudent')
