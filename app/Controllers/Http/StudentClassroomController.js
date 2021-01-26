'use strict'

const { validate } = use('Validator')

const Teacher = use('App/Models/Teacher')
const Student = use('App/Models/Student')
const Classroom = use('App/Models/Classroom')
const StudentClassroom = use('App/Models/StudentClassroom')

class StudentClassroomController {

  async allocateStudent ({ request, response }) {
      
    let classroom = await Classroom.findBy('id', request.all().classroom_id)
    if(!classroom) {
      return response.status(201).json({message: 'Sala de aula nao encontrada'})
    }

    let teacher = await Teacher.findBy('registration', request.all().teacher_registration)
    if(!teacher) {
      return response.status(201).json({
        message: 'O professor informado nao existe no sistema'
      })
    }

    let student = await Student.findBy('registration', request.all().student_registration)
    if(!student) {
      return response.status(201).json({
        message: 'O aluno informado nao existe no sistema'
      })
    }

    if(classroom.teacher_registration != request.all().teacher_registration) {
      return response.status(200).json({message: 'O professor nao pertence a essa sala'})
    }

    if(!classroom.availability || classroom.availability == 0) {
      return response.status(200).json({message: 'A sala de aula informada nao esta disponivel para cadastrar alunos'})
    }

    let studentClassrooms = await StudentClassroom.findBy('student_registration', request.all().student_registration)
    if(studentClassrooms) {
      return response.status(200).json({message: 'Esse aluno ja esta cadastrado na sala'})
    }

    let countStudents = await StudentClassroom.query().where('classroom_id', request.all().classroom_id).getCount()
    if(countStudents >= classroom.capacity) {
      return response.status(200).json({message: 'Essa sala de aula esta com a quantidade de alunos maxima'})
    }

    try {
      await StudentClassroom.create(request.all())

      return response.status(201).json({
        message: 'Aluno adicionado a sala de aula com sucesso',
        success: true
      })
    } catch (e) {
      return response.status(302).json({
        message: 'Erro Interno' + e.code
      })
    }

  }

  async getAllocateStudent({ request, response, params }) {
    let { registration_id } = params

    let student = await Student.findBy('registration', registration_id)
    if(!student) {
      return response.status(200).json({message: 'Esse aluno nao existe no sistema'})
    }

    let studentClassRooms = await StudentClassroom.query()
    .where('student_registration', registration_id)
    .fetch()

    return response.status(201).json({
      name: student.name,
      rooms: [studentClassRooms]
    })
  }

}

module.exports = StudentClassroomController
