import { check } from 'express-validator'

const create = [

]

const update = [
  check('riderComment').isString().isLength({ min: 1, max: 255 }).trim()
]

export { create, update }
