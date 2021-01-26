'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class StudentsSchema extends Schema {
  up () {
    this.create('students', (table) => {
      table.increments()
      table.string('name', 80).notNullable()
      table.string('email', 254).notNullable().unique()
      table.integer('registration', 80).notNullable().unique()
      table.date('birth').notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('students')
  }
}

module.exports = StudentsSchema
