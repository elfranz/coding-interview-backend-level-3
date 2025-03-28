import Hapi from '@hapi/hapi'
import { defineRoutes } from './routes'
import prisma from './database';

const getServer = () => {
    const server = Hapi.server({
        host: 'localhost',
        port: 3000,
    })

    // Global error handling extension
    server.ext('onPreResponse', (request, h) => {
        const { response } = request;
        // Check if the response is an error (Boom or not)
        if (response instanceof Error) {
        // If it's a Boom error, you can safely assume response.isBoom is true.
            if (response.isBoom) {
                const boomError = response;
                // For 400 errors, if there's a custom errors array attached, use that.
                if (boomError.output.statusCode === 400 && boomError.data && (boomError.data as any).errors) {
                    return h.response({ errors: (boomError.data as any).errors }).code(400);
                }
                // Otherwise, return a more generic error message
                return h.response({ message: boomError.message }).code(boomError.output.statusCode);
            }
            // If it's a non-Boom error, you can still format it if needed.
            return h.response({ message: response.message || 'An error occurred' }).code(500);
        }
        return h.continue;
    });

    defineRoutes(server)

    return server
}

export const initializeServer = async () => {
    const server = getServer();
  
    if (process.env.NODE_ENV === 'test') {
        // Reset mock database between tests
        await prisma.item.deleteMany();
    }

    await server.initialize();
    return server;
}

export const startServer = async () => {
    const server = getServer()
    await server.start()
    console.log(`Server running on ${server.info.uri}`)
    return server
};