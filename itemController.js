const Item = require('./models/item');
const createItem = async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;


    if (!name || price === undefined || quantity === undefined) {
      return res.status(400).json({ error: 'Name, price, and quantity are required.' });
    }

    const newItem = new Item({ name, description, price, quantity });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    const { name, description, price, quantity } = req.body;
    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price || item.price;
    item.quantity = quantity || item.quantity;

    await item.save();
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: 'Item not found' });

    await item.remove();
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = {
  createItem,
  getAllItems,
  getItem,
  updateItem,
  deleteItem
};
