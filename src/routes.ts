import { Server } from "@hapi/hapi"
import { getAll } from "./controllers/items.controller"

export const defineRoutes = (server: Server) => {
    // Items
    server.route({
        method: 'GET',
        path: '/items',
        handler: getAll
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