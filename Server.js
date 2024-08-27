const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(cors());

let records = Array.from({ length: 200 }, (_, i) => ({
    id: i + 1,
    column1: ` ${i + 1}-1`,
    column2: ` ${i + 1}-2`,
    column3: ` ${i + 1}-3`,
    column4: ` ${i + 1}-4`,
    column5: ` ${i + 1}-5`
}));

app.get('/records', (req, res) => {
    console.log('Fetching all records');
    res.json(records);
});

app.get('/records/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    console.log(`Fetching record with ID: ${id}`);
    const record = records.find(r => r.id === id);
    if (record) {
        res.json(record);
    } else {
        console.log(`Record with ID: ${id} not found`);
        res.status(404).send('Record not found');
    }
});

app.post('/records', (req, res) => {
    const record = req.body;
    record.id = records.length ? records[records.length - 1].id + 1 : 1; 
    records.push(record);
    console.log('Added new record:', record);
    res.status(201).json(record);
});

app.put('/records/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    const record = records.find(r => r.id === id);
    if (record) {
        Object.assign(record, req.body);
        console.log('Updated record:', record);
        res.json(record);
    } else {
        console.log(`Record with ID: ${id} not found for update`);
        res.status(404).send('Record not found');
    }
});

app.delete('/records/:id', (req, res) => {
    const id = parseInt(req.params.id, 10);
    records = records.filter(r => r.id !== id);
    console.log(`Deleted record with ID: ${id}`);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
