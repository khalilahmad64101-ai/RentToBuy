import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  name: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, default: 45 },
  weeklyRate: { type: Number, default: 45 },
  deposit: { type: Number, default: 150 },
  description: { type: String, default: '' },
  year: { type: String, default: '2024' },
  fuel: { type: String, default: 'Petrol' },
  transmission: { type: String, default: 'Manual' },
  mileage: { type: String, default: '18,000 miles' },
  image: { type: String, default: '' },
  images: { type: [String], default: [] },
  status: { type: String, default: 'Available' },
  specs: { type: [String], default: [] }
}, { timestamps: true });

export const Car = mongoose.models.Car || mongoose.model('Car', carSchema);
