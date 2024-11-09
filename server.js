const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const quotesFile = path.join(__dirname, 'quotes.json');

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.static(__dirname));

// Endpoint to get quotes
app.get('/quotes', (req, res) => {
    fs.readFile(quotesFile, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading quotes file');
        } else {
            res.json(JSON.parse(data));
        }
    });
});

// Endpoint to add a new quote
app.post('/add-quote', (req, res) => {
    const newQuote = req.body;

    fs.readFile(quotesFile, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading quotes file');
        } else {
            const quotes = JSON.parse(data);
            quotes.push(newQuote);

            fs.writeFile(quotesFile, JSON.stringify(quotes, null, 2), (err) => {
                if (err) {
                    res.status(500).send('Error writing to quotes file');
                } else {
                    res.status(200).send('Quote added successfully');
                }
            });
        }
    });
});

// Endpoint to upvote a quote
app.post('/upvote-quote', (req, res) => {
    const { index } = req.body;

    fs.readFile(quotesFile, 'utf-8', (err, data) => {
        if (err) {
            res.status(500).send('Error reading quotes file');
        } else {
            const quotes = JSON.parse(data);
            if (quotes[index]) {
                quotes[index].votes += 1;

                fs.writeFile(quotesFile, JSON.stringify(quotes, null, 2), (err) => {
                    if (err) {
                        res.status(500).send('Error writing to quotes file');
                    } else {
                        res.status(200).send('Upvote recorded');
                    }
                });
            } else {
                res.status(400).send('Invalid quote index');
            }
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
