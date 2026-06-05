import { loadJson, saveJson, CARS_FILE } from '../utils/storage.js';

export const getCars = (req, res) => {
  const carsStore = loadJson(CARS_FILE, []);
  res.json(carsStore);
};

export const addCar = (req, res) => {
  const carsStore = loadJson(CARS_FILE, []);
  const { name, model, price, fuel, transmission, image, economy, specs, category, engine, color, description, images } = req.body;
  if (!name || !model) {
    return res.status(400).json({ error: "Missing target vehicle specifications layout" });
  }

  const newCar = {
    id: `car_${Date.now()}`,
    name: name.toUpperCase(),
    model: model.toUpperCase(),
    price: Number(price) || 45,
    weeklyRate: Number(price) || 45,
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
  };

  carsStore.unshift(newCar);
  saveJson(CARS_FILE, carsStore);
  res.status(201).json(newCar);
};

export const updateCar = (req, res) => {
  const carsStore = loadJson(CARS_FILE, []);
  const { id } = req.params;
  const index = carsStore.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Vehicle index target not stored" });
  }

  carsStore[index] = { ...carsStore[index], ...req.body };
  saveJson(CARS_FILE, carsStore);
  res.json(carsStore[index]);
};

export const deleteCar = (req, res) => {
  let carsStore = loadJson(CARS_FILE, []);
  const { id } = req.params;
  const beforeLength = carsStore.length;
  carsStore = carsStore.filter(c => c.id !== id);
  if (carsStore.length === beforeLength) {
    return res.status(404).json({ error: "Deletion target vehicle index invalid" });
  }
  saveJson(CARS_FILE, carsStore);
  res.json({ message: "Asset purged from live fleet database index." });
};
