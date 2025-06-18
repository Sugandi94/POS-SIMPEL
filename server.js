const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname)));

// Utility functions to read/write JSON files
const readJSONFile = (filename) => {
    const filepath = path.join(__dirname, filename);
    if (!fs.existsSync(filepath)) {
        fs.writeFileSync(filepath, JSON.stringify([]));
    }
    const data = fs.readFileSync(filepath);
    return JSON.parse(data);
};

const writeJSONFile = (filename, data) => {
    const filepath = path.join(__dirname, filename);
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2));
};

// Products API
app.get('/api/products', (req, res) => {
    const products = readJSONFile('products.json');
    res.json(products);
});

app.post('/api/products', (req, res) => {
    const products = readJSONFile('products.json');
    const newProduct = req.body;

    // Check for duplicate barcode
    if (products.find(p => p.barcode === newProduct.barcode)) {
        return res.status(400).json({ error: 'Barcode already exists' });
    }

    products.push(newProduct);
    writeJSONFile('products.json', products);
    res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
    const products = readJSONFile('products.json');
    const productId = req.params.id;
    const updatedProduct = req.body;

    const index = products.findIndex(p => p.id === productId);
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    products[index] = updatedProduct;
    writeJSONFile('products.json', products);
    res.json(updatedProduct);
});

app.delete('/api/products/:id', (req, res) => {
    let products = readJSONFile('products.json');
    const productId = req.params.id;

    const index = products.findIndex(p => p.id === productId);
    if (index === -1) {
        return res.status(404).json({ error: 'Product not found' });
    }

    products = products.filter(p => p.id !== productId);
    writeJSONFile('products.json', products);
    res.json({ message: 'Product deleted' });
});

// Categories API
app.get('/api/categories', (req, res) => {
    const categories = readJSONFile('categories.json');
    res.json(categories);
});

app.post('/api/categories', (req, res) => {
    const categories = readJSONFile('categories.json');
    const newCategory = req.body;

    // Check for duplicate category name (case insensitive)
    if (categories.find(c => c.name.toLowerCase() === newCategory.name.toLowerCase())) {
        return res.status(400).json({ error: 'Category name already exists' });
    }

    categories.push(newCategory);
    writeJSONFile('categories.json', categories);
    res.status(201).json(newCategory);
});

app.put('/api/categories/:id', (req, res) => {
    const categories = readJSONFile('categories.json');
    const categoryId = req.params.id;
    const updatedCategory = req.body;

    const index = categories.findIndex(c => c.id === categoryId);
    if (index === -1) {
        return res.status(404).json({ error: 'Category not found' });
    }

    categories[index] = updatedCategory;
    writeJSONFile('categories.json', categories);
    res.json(updatedCategory);
});

app.delete('/api/categories/:id', (req, res) => {
    let categories = readJSONFile('categories.json');
    const categoryId = req.params.id;

    const index = categories.findIndex(c => c.id === categoryId);
    if (index === -1) {
        return res.status(404).json({ error: 'Category not found' });
    }

    categories = categories.filter(c => c.id !== categoryId);
    writeJSONFile('categories.json', categories);
    res.json({ message: 'Category deleted' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
