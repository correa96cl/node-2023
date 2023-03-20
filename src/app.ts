import fastify from 'fastify';
import { knex } from './database';
import { env } from './env';
import { transactionsRoutes } from './routes/transactions';
import cookie from '@fastify/cookie'

export const app = fastify()
app.register(cookie)

app.addHook('preHandler', async (request,reply) => {
        
})

app.register(transactionsRoutes, {
    prefix: 'transactions'
})