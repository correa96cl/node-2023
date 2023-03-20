import { expect, afterAll, beforeAll, describe, it, beforeEach } from "vitest";
import { app } from "../src/app";
import request from 'supertest'
import { execSync } from "node:child_process";

describe('Transactions routes', () => {
    beforeAll(async () => {

        await app.ready()
    })
})

afterAll(async () => {
    await app.close()
})

beforeEach(() => {
    execSync('npm run migrate:rollback --all')
    execSync('npm run migrate:latest')
})

it('should be able to create a new transaction', async () => {
    await request(app.server).post('/transactions').send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit'
    }).expect(201)




})

it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server).post('/transactions').send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit'
    })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const sumaryResponse = await request(app.server).get('/transactions').set('Cookie', cookies).expect(200)

    expect(sumaryResponse.body.transactions).toEqual([
        expect.objectContaining({
            title: 'New Transaction',
            amount: 5000,
        }),
    ])

})

it('should be able to get a specific transactions', async () => {
    const createTransactionResponse = await request(app.server).post('/transactions').send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit'
    })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const sumaryResponse = await request(app.server).get('/transactions').set('Cookie', cookies).expect(200)

    const transactionId = sumaryResponse.body.transactions[0].id

    const getTransactionResponse = await request(app.server).get(`/transactions/${transactionId}`).set('Cookie', cookies).expect(200)


    expect(getTransactionResponse.body.transaction).toEqual(
        expect.objectContaining({
            title: 'New Transaction',
            amount: 5000,
        }),
    )

})



it('should be able to get summary', async () => {
    const createTransactionResponse = await request(app.server).post('/transactions').send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit'
    })

    const cookies = createTransactionResponse.get('Set-Cookie')

    await request(app.server).post('/transactions').send({
        title: 'New Transaction',
        amount: 5000,
        type: 'debit'
    })

    const sumaryResponse = await request(app.server).get('/transactions/summary').set('Cookie', cookies).expect(200)

    expect(sumaryResponse.body.summary).toEqual({
        amount: 5000,
    })

})