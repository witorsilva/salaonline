'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class ClassroomsSchema extends Schema {
  up () {
    this.create('classrooms', (table) => {
      table.increments()
      table.integer('number').notNullable()
      table.integer('teacher_registration').notNullable()
      table.boolean('availability').notNullable()
      table.integer('capacity').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('classrooms')
  }
}

module.exports = ClassroomsSchema
