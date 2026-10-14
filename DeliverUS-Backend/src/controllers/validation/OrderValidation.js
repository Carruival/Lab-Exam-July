import { check } from 'express-validator'

const create = [

]

const update = [
  check('riderComments').isString().isLength({ max: 500 }).trim()
]

export { create, update }
