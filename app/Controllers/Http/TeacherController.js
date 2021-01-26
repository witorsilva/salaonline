'use strict'

const { validate } = use('Validator')

const Teacher = use('App/Models/Teacher')

class TeacherController {

  rules ({ request, response }) {
    let registration_id = this.request.params.registration_id

    return {
      name: 'required',
      email: `required|email|unique:teachers,email,registration,${registration_id}`,
      birth: 'required|date',
      registration: `required|unique:teachers,registration,registration,${registration_id}`
    }
  }

  async index ({ request, response }) {
    var teachers = await Teacher.all()
    
    if( teachers.rows.length <= 0 ) {
      return response.json({ message: "Nao existem professores cadastrados no sistema" })
    }

    return response.json(teachers)
  }

  async store ({ request, response }) {
    const validation = await validate(request.all(), this.rules)
    if (validation.fails()) {
      return response.json(validation.messages())
    }

    try {
      await Teacher.create(request.all())

      return response.status(201).json({
        message: 'Professor criado com sucesso',
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

    let teacher = await Teacher.findBy('registration', registration_id || 0)
    
    if(!teacher) {
      return response.status(200).json({message: 'Professor nao encontrado'})
    }

    return response.status(200).json(teacher)
  }

  async update ({ request, response, params }) {
    const { registration_id } = params

    let teacher = await Teacher.findBy('registration', registration_id)
    if(!teacher) {
      return response.status(200).json({message: 'Professor nao encontrado'})
    }

    const validation = await validate(request.all(), this.rules)
    if (validation.fails()) {
      return response.json(validation.messages())
    }

    let new_registration = request.all().registration

    if(new_registration !== registration_id && await Teacher.findBy('registration', request.all().registration)) {
      return response.status(200).json({message: 'Essa matricula pertence a outro professor'})
    }

    teacher.merge(request.all())
    if(await teacher.save()) {
      return response.status(200).json({message: 'Professor editado com sucesso'})
    }
  }

  async destroy({ request, response, params }) {
    let { registration_id } = params

    let teacher = await Teacher.findBy('registration', registration_id)

    if(!teacher) {
      return response.status(201).json({message: 'Professor nao encontrado'})
    }

    if(teacher.delete()) {
      return response.status(201).json({message: `Professor ${teacher.name} removido com sucesso!`})
    }
  }

}

module.exports = TeacherController
