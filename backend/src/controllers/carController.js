import mongoose from 'mongoose';
import { Car } from '../models/Car.js';

export const getCars = async (req, res) => {
  try {
    const cars = await Car.find({}).sort({ createdAt: -1 });
    res.json(cars);
  } catch (err) {
    console.error('[carController] getCars error:', err);
    res.status(500).json({ error: 'Failed to retrieve vehicle listings from MongoDB.' });
  }
};

export const addCar = async (req, res) => {
  try {
    const { name, model, price, deposit, fuel, transmission, image, economy, specs, category, engine, color, description, images } = req.body;
    if (!name || !model) {
      return res.status(400).json({ error: "Missing target vehicle specifications layout" });
    }

    const newCar = new Car({
      name: name.toUpperCase(),
      model: model.toUpperCase(),
      price: Number(price) || 45,
      weeklyRate: Number(price) || 45,
      deposit: Number(deposit) || 150,
      depositAmount: Number(deposit) || 150,
      fuel: fuel || "Petrol",
      transmission: transmission || "Manual",
      economy: economy || "55 mpg",
      image: image || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800",
      specs: specs || ["Premium standard condition"],
      category: category || "Rent-to-Buy",
      engine: engine || "1.0L Dynamic Fuel-Saving",
      color: color || "Midnight Quartz",
      description: description || "",
      images: Array.isArray(images) && images.length > 0 ? images : [image || "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&q=80&w=800"]
    });

    await newCar.save();
    res.status(201).json(newCar);
  } catch (err) {
    console.error('[carController] addCar error:', err);
    res.status(500).json({ error: 'Failed to insert standard vehicle listing into MongoDB.' });
  }
};

export const updateCar = async (req, res) => {
  try {
    const { id } = req.params;
    const query = mongoose.isValidObjectId(id) 
      ? { $or: [{ id }, { _id: id }] } 
      : { id };

    const updated = await Car.findOneAndUpdate(
      query,
      { $set: req.body },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: "Vehicle index target not stored" });
    }

    res.json(updated);
  } catch (err) {
    console.error('[carController] updateCar error:', err);
    res.status(500).json({ error: 'Failed to update vehicle record inside MongoDB.' });
  }
};

export const deleteCar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Support either clean MongoDB IDs or custom string id fields seamlessly
    const query = { id };

    const deleted = await Car.findOneAndDelete(query);
    if (!deleted) {
      // In case it was queried using _id directly
      const deletedByMongoId = await Car.findByIdAndDelete(id);
      if (!deletedByMongoId) {
        return res.status(404).json({ error: "Deletion target vehicle index invalid" });
      }
    }

    res.json({ message: "Asset purged from live fleet database index." });
  } catch (err) {
    console.error('[carController] deleteCar error:', err);
    res.status(500).json({ error: 'Failed to delete vehicle record from MongoDB.' });
  }
};
