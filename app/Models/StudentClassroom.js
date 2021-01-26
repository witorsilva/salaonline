'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class StudentClassroom extends Model {
  static get table () {
    return 'studentclassrooms'
  }
}

module.exports = StudentClassroom
