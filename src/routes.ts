import { Server } from "@hapi/hapi"
import * as itemsController from "./controllers/items.controller"

export const defineRoutes = (server: Server) => {
    // Items
    server.route({
        method: 'GET',
        path: '/items',
        handler: itemsController.getAll
    })

    server.route({
        method: 'GET',
        path: '/items/{id}',
        handler: itemsController.get
    })

    server.route({
        method: 'POST',
        path: '/items',
        handler: itemsController.create
    })

    server.route({
        method: 'PATCH',
        path: '/items/{id}',
        handler: itemsController.update
    })

    server.route({
        method: 'DELETE',
        path: '/items/{id}',
        handler: itemsController.deleteItem
    })

    // Health Check
    server.route({
        method: 'GET',
        path: '/ping',
        handler: async (request, h) => {
            return {
                ok: true
            }
        }
    })
}