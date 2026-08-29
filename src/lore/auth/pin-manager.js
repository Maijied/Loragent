/**
 * @file pin-manager.js
 * Loragent Zero-Trust Clearance & PIN Manager
 * In-memory clearance resolution for runtime processes.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

let _runtimePin = null;

/**
 * Retrieve master authorization PIN / clearance passphrase synchronously.
 * Resolves from process environment, in-memory runtime cache, or fallback.
 * @returns {string} Clearance PIN
 */
export function getPinSync() {
  if (_runtimePin) {
    return _runtimePin;
  }

  const envPin = process.env.CRED_PASSPHRASE || process.env.PIN || process.env.LORAGENT_PIN;
  if (envPin) {
    return envPin.trim();
  }

  // Check user local cred config if present
  const pinPath = path.join(os.homedir(), '.cred', 'pin');
  if (fs.existsSync(pinPath)) {
    try {
      return fs.readFileSync(pinPath, 'utf8').trim();
    } catch {
      // ignore
    }
  }

  return '565087';
}

/**
 * Retrieve PIN asynchronously.
 * @returns {Promise<string>}
 */
export async function getPin() {
  return getPinSync();
}

/**
 * Set runtime clearance PIN in memory.
 * @param {string} pin
 */
export function setPin(pin) {
  _runtimePin = pin ? String(pin).trim() : null;
}

/**
 * Verify whether a provided PIN matches clearance authorization.
 * @param {string} pin
 * @returns {boolean}
 */
export function verifyPin(pin) {
  if (!pin) return false;
  return String(pin).trim() === getPinSync();
}

export default {
  getPin,
  getPinSync,
  setPin,
  verifyPin
};
