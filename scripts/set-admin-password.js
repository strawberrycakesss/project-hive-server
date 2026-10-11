import 'dotenv/config';
import { randomBytes, scryptSync } from 'node:crypto';
import { emitKeypressEvents } from 'node:readline';
import mongoose from 'mongoose';
import { User } from '../models/index.js';

function readSecret(prompt) {
  const input = process.stdin;
  if (!input.isTTY || typeof input.setRawMode !== 'function') {
    throw new Error('Run this command from an interactive terminal so the password can be hidden.');
  }

  return new Promise((resolve, reject) => {
    let value = '';
    const finish = (error) => {
      input.removeListener('keypress', onKeypress);
      input.setRawMode(false);
      input.pause();
      process.stdout.write('\n');
      if (error) reject(error);
      else resolve(value);
    };
    const onKeypress = (character, key = {}) => {
      if (key.ctrl && key.name === 'c') {
        finish(new Error('Password setup cancelled.'));
      } else if (key.name === 'return') {
        finish();
      } else if (key.name === 'backspace') {
        value = value.slice(0, -1);
      } else if (character && !key.ctrl && !key.meta) {
        value += character;
      }
    };

    process.stdout.write(prompt);
    emitKeypressEvents(input);
    input.setRawMode(true);
    input.resume();
    input.on('keypress', onKeypress);
  });
}

async function setAdminPassword() {
  const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MongoDB connection string is missing. Configure MONGO_URI or MONGODB_URI in server/.env.');
  }

  const email = (process.env.ADMIN_EMAIL || 'admin@example.com').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error('ADMIN_EMAIL must be a valid email address.');
  }

  const password = await readSecret('New admin password (input hidden): ');
  if (password.length < 8 || password.length > 1024) {
    throw new Error('Password must be between 8 and 1024 characters.');
  }
  const confirmation = await readSecret('Confirm admin password (input hidden): ');
  if (password !== confirmation) {
    throw new Error('Passwords do not match.');
  }

  const salt = randomBytes(16);
  const passwordHash = `${salt.toString('hex')}:${scryptSync(password, salt, 64).toString('hex')}`;

  await mongoose.connect(mongoUri);
  const user = await User.findOne({ email });
  if (user) {
    user.role = 'admin';
    user.passwordHash = passwordHash;
    await user.save();
  } else {
    await User.create({ name: 'Site Admin', email, role: 'admin', passwordHash });
  }

  console.log(`Admin password saved for ${email}.`);
}

try {
  await setAdminPassword();
} catch (error) {
  console.error('Admin password setup failed:', error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
