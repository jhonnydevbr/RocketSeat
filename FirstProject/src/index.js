const express = require('express');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(express.json())

const customers = [];

// Middleware
function verifyExistsAccountCPF(req, res, next) {

    const { cpf } = req.headers

    const customer = customers.find((customer) => customer.cpf === cpf);

    if (!customer) {
        return res.status(400).json({ error: "Customer not found" })
    }

    req.customer = customer;

    return next();
}

function getBalance(statement){
    statement.reduce((acc, operation)=>{
        if(operation === 'credit'){
            return acc + operation.amount;
        }else {
            return acc - operation.amount;
        }
    }, 0);

    return balance;
}

app.post("/account", (req, res) => {

    const { cpf, name } = req.body;

    const customerAlreadyExists = customers.some(
        (customer) => customer.cpf === cpf
    );

    if (customerAlreadyExists) {
        return res.status(400).json({ error: "Customer already exists!" })
    }

    customers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return res.status(201).send();

});

app.get("/statement", verifyExistsAccountCPF, (req, res) => {

    const { customer } = req;

    return res.json(customer.statement);
});

app.post("/deposit", verifyExistsAccountCPF, (req, res)=>{
    const { description, amount } = req.body;

    const { customer } = req;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    }

    customer.statement.push(statementOperation)
    return res.status(201).send();
});

app.post("/withdraw", verifyExistsAccountCPF, (req, res)=>{
    const { amount } = req.body;
    const { customer } = req;

    const balance = getBalance(customer.statement);

    if(balance < amount){
        return res.status(400).json({error: "Insufficiente funds!"})
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    };

    customer.statement.push(statementOperation);

    return res.status(201).send();
})

app.listen(3333);