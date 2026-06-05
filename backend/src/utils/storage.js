import fs from 'fs';
import path from 'path';

export const DATABASE_DIR = path.resolve(process.cwd(), 'backend', 'database');
export const CARS_FILE = path.join(DATABASE_DIR, 'cars.json');
export const USERS_FILE = path.join(DATABASE_DIR, 'users.json');
export const APPLICATIONS_FILE = path.join(DATABASE_DIR, 'applications.json');
export const AGREEMENTS_FILE = path.join(DATABASE_DIR, 'agreements.json');
export const PAYMENTS_FILE = path.join(DATABASE_DIR, 'payments.json');
export const EMAILS_FILE = path.join(DATABASE_DIR, 'emails.json');
export const INQUIRIES_FILE = path.join(DATABASE_DIR, 'inquiries.json');

export const loadJson = (filepath, defaultValue) => {
  try {
    if (fs.existsSync(filepath)) {
      const data = fs.readFileSync(filepath, 'utf8');
      let parsed = JSON.parse(data);
      if (Array.isArray(parsed) && filepath.endsWith('applications.json')) {
        parsed = parsed.filter(app => {
          if (!app) return false;
          if (app.id === 'APP-5341' || app.id === 'APP-1481') return false;
          if (app.licenseFrontUrl && app.licenseFrontUrl.includes('unsplash.com')) return false;
          if (app.licenseBackUrl && app.licenseBackUrl.includes('unsplash.com')) return false;
          if (app.selfieUrl && app.selfieUrl.includes('unsplash.com')) return false;
          if (app.applyDetails?.drivingLicence && app.applyDetails.drivingLicence.includes('unsplash.com')) return false;
          return true;
        });
      }
      return parsed;
    } else {
      fs.mkdirSync(path.dirname(filepath), { recursive: true });
      fs.writeFileSync(filepath, JSON.stringify(defaultValue, null, 2), 'utf8');
      return defaultValue;
    }
  } catch (err) {
    console.error(`Error loading database file at ${filepath}:`, err);
    return defaultValue;
  }
};

export const saveJson = (filepath, data) => {
  try {
    fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing database file at ${filepath}:`, err);
  }
};
