'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StudentclassroomSchema extends Schema {
  up () {
    this.create('studentclassrooms', (table) => {
      table.increments()
      table.integer('student_registration')
      table.integer('teacher_registration')
      table.integer('classroom_id')
      table.timestamps()
    })
  }

  down () {
    this.drop('studentclassrooms')
  }
}

module.exports = StudentclassroomSchema
