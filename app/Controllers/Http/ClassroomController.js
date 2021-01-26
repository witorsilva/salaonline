'use strict'

const { validate } = use('Validator')

const Classroom = use('App/Models/Classroom')
const Teacher = use('App/Models/Teacher')

class ClassroomController {

  rules ({ request, response }) {
    let number = this.request.params.number

    return {
      number: `required|unique:classrooms,number,${number}`,
      teacher_registration: 'required',
      capacity: 'required',
      availability: 'required'
    }
  }

  async index ({ request, response }) {
    var classrooms = await Classroom.all()
    
    if( classrooms.rows.length <= 0 ) {
      return response.json({ message: "Nao existem salas cadastradas no sistema" })
    }

    return response.json(classrooms)
  }

  async show ({ request, response, params }) {
    const { number } = params;

    let classroom = await Classroom.findBy('number', number)
    if(!classroom) {
      return response.status(200).json({message: 'Sala nao encontrada'})
    }

    return response.status(200).json(classroom)
  }

  async store ({ request, response }) {
    const validation = await validate(request.all(), this.rules)
    if (validation.fails()) {
      return response.json(validation.messages())
    }

    let teacher = await Teacher.findBy('registration', request.all().teacher_registration)
    if(!teacher) {
      return response.status(201).json({
        message: 'O professor informado nao existe no sistema'
      })
    }

    try {
      await Classroom.create(request.all())

      return response.status(201).json({
        message: 'Sala criada com sucesso',
        success: true
      })
    } catch (e) {
      return response.status(302).json({
        message: 'Erro Interno' + e.code
      })
    }
  }

  async update ({ request, response, params }) {
    const { number } = params

    let classroom = await Classroom.findBy('number', number)
    if(!classroom) {
      return response.status(200).json({message: 'Sala de aula nao encontrada'})
    }

    const validation = await validate(request.all(), this.rules)
    if (validation.fails()) {
      return response.json(validation.messages())
    }

    if(classroom.teacher_registration != request.all().teacher_registration) {
      return response.status(200).json({message: 'O professor nao pertence a essa sala'})
    }

    classroom.merge(request.all())
    if(await classroom.save()) {
      return response.status(200).json({message: 'Sala editada com sucesso'})
    }

  }

  async destroy({ request, response, params }) {
    let { number } = params

    let classroom = await Classroom.findBy('number', number)
    if(!classroom) {
      return response.status(200).json({message: 'Sala de aula nao encontrada'})
    }

    if(classroom.teacher_registration != request.all().teacher_registration) {
      return response.status(200).json({message: 'O professor nao pertence a essa sala'})
    }

    if(classroom.delete()) {
      return response.status(201).json({message: `Sala ${classroom.number} removida com sucesso!`})
    }
  }

}

module.exports = ClassroomController
