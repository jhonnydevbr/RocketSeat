import fastify from "fastify";
import { knex } from "./database";

const app = fastify();

app.get('/hello', async ()=>{

    const transaction = await knex('transactions')
    .select('*')
    .where('amount', 1000)

    return transaction
})

app.listen({
    port: 3333
}).then(()=>{
    console.log('HTTP Server Runing!')
})