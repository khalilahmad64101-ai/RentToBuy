import mongoose from 'mongoose';

const carSchema = new mongoose.Schema({
  id: { type: String, unique: true }, // Store string ID (e.g. car_1, car_2 or auto-generated)
  name: { type: String, required: true },
  model: { type: String, required: true },
  price: { type: Number, default: 45 },
  weeklyRate: { type: Number, default: 45 },
  deposit: { type: Number, default: 150 },
  depositAmount: { type: Number, default: 150 },
  description: { type: String, default: '' },
  year: { type: mongoose.Schema.Types.Mixed, default: '2024' },
  fuel: { type: String, default: 'Petrol' },
  transmission: { type: String, default: 'Manual' },
  mileage: { type: String, default: '18,500 miles' },
  economy: { type: String, default: '50 MPG' },
  image: { type: String, default: '' },
  images: { type: [String], default: [] },
  status: { type: String, default: 'Available' },
  specs: { type: [String], default: [] },
  features: { type: [String], default: [] },
  category: { type: String, default: 'Rent-to-Buy' },
  engine: { type: String, default: '' },
  color: { type: String, default: '' }
}, { timestamps: true });

// Sync id field with _id pre-save if not explicitly set
carSchema.pre('save', function (next) {
  if (!this.id) {
    this.id = 'car_' + this._id.toString();
  }
  next();
});

carSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    delete ret.__v;
    return ret;
  }
});

export const Car = mongoose.models.Car || mongoose.model('Car', carSchema);
