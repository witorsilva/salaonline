'use strict'

const { validate } = use('Validator')

const Student = use('App/Models/Student')

class StudentController {

  rules ({ request, response }) {
    let registration_id = this.request.params.registration_id

    return {
      name: 'required',
      email: `required|email|unique:students,email,registration,${registration_id}`,
      birth: 'required|date',
      registration: `required|unique:students,registration,registration,${registration_id}`
    }
  }

  async index ({ request, response }) {
    var students = await Student.all()
    
    if( students.rows.length <= 0 ) {
      return response.json({ message: "Nao existem alunos cadastrados no sistema" })
    }

    return response.json(students)
  }

  async store ({ request, response }) {
    const validation = await validate(request.all(), this.rules)
    if (validation.fails()) {
      return response.json(validation.messages())
    }

    try {
      await Student.create(request.all())

      return response.status(201).json({
        message: 'Aluno criado com sucesso',
        success: true
      })
    } catch (e) {
      return response.status(302).json({
        message: 'Erro Interno' + e.code
      })
    }
  }

  async show ({ request, response, params }) {
    const { registration_id } = params;

    let student = await Student.findBy('registration', registration_id || 0)
    
    if(!student) {
      return response.status(200).json({message: 'Aluno nao encontrado'})
    }

    return response.status(200).json(student)
  }

  async update ({ request, response, params }) {
    const { registration_id } = params

    let student = await Student.findBy('registration', registration_id)
    if(!student) {
      return response.status(200).json({message: 'Aluno nao encontrado'})
    }

    const validation = await validate(request.all(), this.rules)
    if (validation.fails()) {
      return response.json(validation.messages())
    }

    let new_registration = request.all().registration

    if(new_registration !== registration_id && await Student.findBy('registration', request.all().registration)) {
      return response.status(200).json({message: 'Essa matricula pertence a outro aluno'})
    }

    student.merge(request.all())
    if(await student.save()) {
      return response.status(200).json({message: 'Aluno editado com sucesso'})
    }
  }

  async destroy({ request, response, params }) {
    let { registration_id } = params

    let student = await Student.findBy('registration', registration_id)

    if(!student) {
      return response.status(201).json({message: 'Aluno nao encontrado'})
    }

    if(student.delete()) {
      return response.status(201).json({message: `Aluno ${student.name} removido com sucesso!`})
    }
  }
}

module.exports = StudentController
