import OrderController from '../controllers/OrderController.js'
import { hasRole, isLoggedIn } from '../middlewares/AuthMiddleware.js'
import { checkEntityExists } from '../middlewares/EntityMiddleware.js'
import * as OrderMiddleware from '../middlewares/OrderMiddleware.js'
import { Order } from '../models/models.js'
import { handleValidation } from '../middlewares/ValidationHandlingMiddleware.js'
import * as OrderValidation from '../controllers/validation/OrderValidation.js'
import { check } from 'express-validator'

const loadFileRoutes = function (app) {
  app.route('/orders/:orderId/confirm')
    .patch(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Order, 'orderId'),
      OrderMiddleware.checkOrderOwnership,
      OrderMiddleware.checkOrderIsPending,
      OrderController.confirm)
  app.route('/orders/:orderId/send')
    .patch(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Order, 'orderId'),
      OrderMiddleware.checkOrderOwnership,
      OrderMiddleware.checkOrderCanBeSent,
      OrderController.send)

  app.route('/orders/:orderId/deliver')
    .patch(
      isLoggedIn,
      hasRole('owner'),
      checkEntityExists(Order, 'orderId'),
      OrderMiddleware.checkOrderOwnership,
      OrderMiddleware.checkOrderCanBeDelivered,
      OrderController.deliver)

  app.route('/orders/available')
    .get(
      isLoggedIn,
      hasRole('rider'),
      OrderController.findAvailableOrders)

  app.route('/orders/rider')
    .get(
      isLoggedIn,
      hasRole('rider'),
      OrderController.showRiderOrder
    )

  app.route('/orders/:orderId')
    .get(
      isLoggedIn,
      checkEntityExists(Order, 'orderId'),
      OrderMiddleware.checkOrderVisible,
      OrderController.show)
  
  app.route('/orders/:orderId/accept')
    .patch(
      isLoggedIn,
      hasRole('rider'),
      checkEntityExists(Order, 'orderId'),
      OrderMiddleware.checkOrderCanBeSent,
      OrderController.accept
    )

  app.route('/orders/:orderId/riderComments')
    .patch(
      isLoggedIn,
      hasRole('rider'),
      checkEntityExists(Order, 'orderId'),
      OrderMiddleware.checkOrderAssignedToRider,
      OrderValidation.update,
      handleValidation,
      OrderController.riderComment
    )

  app.route('/orders/:orderId/riderDeliver')
    .patch(
      isLoggedIn,
      hasRole('rider'),
      checkEntityExists(Order, 'orderId'),
      OrderMiddleware.checkOrderAssignedToRider,
      OrderMiddleware.checkOrderCanBeSent,
      OrderMiddleware.checkOrderCanBeDelivered,
      OrderController.deliver
    )
}

export default loadFileRoutes
