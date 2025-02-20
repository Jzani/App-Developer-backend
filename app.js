const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Item = require('./models/item');  

const app = express();


app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/Inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log('MongoDB connection error:', err));

app.post('/add-item', (req, res) => {
    const { name, description, price, quantity } = req.body;
    const newItem = new Item({ name, description, price, quantity });

    newItem.save()
      .then(() => res.status(201).json({ message: 'Item added successfully!' }))
      .catch((err) => res.status(500).json({ error: 'Failed to add item', details: err.message }));
});


app.get('/items', (req, res) => {
    Item.find()
      .then((items) => res.status(200).json(items))
      .catch((err) => res.status(500).json({ error: 'Failed to fetch items', details: err.message }));
});


app.get('/items/:id', (req, res) => {
    const { id } = req.params;
    Item.findById(id)
      .then((item) => {
          if (!item) {
              return res.status(404).json({ error: 'Item not found' });
          }
          res.status(200).json(item);
      })
      .catch((err) => res.status(500).json({ error: 'Failed to fetch item', details: err.message }));
});


app.put('/update-item/:id', (req, res) => {
    const { id } = req.params;
    const { name, description, price, quantity } = req.body;

    Item.findByIdAndUpdate(id, { name, description, price, quantity }, { new: true })
      .then((updatedItem) => {
          if (!updatedItem) {
              return res.status(404).json({ error: 'Item not found' });
          }
          res.status(200).json({ message: 'Item updated successfully!', item: updatedItem });
      })
      .catch((err) => res.status(500).json({ error: 'Failed to update item', details: err.message }));
});


app.delete('/delete-item/:id', (req, res) => {
    const { id } = req.params;

    Item.findByIdAndDelete(id)
      .then((deletedItem) => {
          if (!deletedItem) {
              return res.status(404).json({ error: 'Item not found' });
          }
          res.status(200).json({ message: 'Item deleted successfully' });
      })
      .catch((err) => res.status(500).json({ error: 'Failed to delete item', details: err.message }));
});


const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


  
