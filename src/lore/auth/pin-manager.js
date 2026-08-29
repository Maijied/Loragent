/**
 * @file pin-manager.js
 * Loragent Zero-Trust Clearance & In-Memory PIN Manager
 * 
 * Strict Zero-Trust Directive: NEVER store or return hardcoded plaintext PINs/passphrases.
 * Resolves exclusively from runtime environment, in-memory cache, or secure local keyring.
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

let _runtimePin = null;

/**
 * Retrieve master authorization PIN / clearance passphrase synchronously.
 * Resolves from in-memory cache, environment variable, or secure local keyring.
 * @returns {string} Clearance PIN or empty string if unauthenticated.
 */
export function getPinSync() {
  if (_runtimePin) {
    return _runtimePin;
  }

  const envPin = process.env.CRED_PASSPHRASE || process.env.PIN || process.env.LORAGENT_PIN || process.env.TITI_PIN;
  if (envPin && envPin.trim()) {
    return envPin.trim();
  }

  // Check user local secure keyring if present
  const candidatePaths = [
    path.join(os.homedir(), '.cred', 'pin'),
    path.join(os.homedir(), '.titi', 'pin'),
    '/mnt/NewVolume/Personal_Projects/cred/.pin'
  ];

  for (const p of candidatePaths) {
    if (fs.existsSync(p)) {
      try {
        const val = fs.readFileSync(p, 'utf8').trim();
        if (val) return val;
      } catch {
        // ignore unreadable keyring file
      }
    }
  }

  return '';
}

/**
 * Retrieve PIN asynchronously.
 * @returns {Promise<string>}
 */
export async function getPin() {
  return getPinSync();
}

/**
 * Set runtime clearance PIN in process memory.
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
  const activePin = getPinSync();
  if (!activePin) {
    // If no pin is pre-configured, verify format (6+ alphanumeric digits) and accept into runtime memory
    if (/^[0-9a-zA-Z]{6,}$/.test(String(pin).trim())) {
      setPin(pin);
      return true;
    }
    return false;
  }
  return String(pin).trim() === activePin;
}

export default {
  getPin,
  getPinSync,
  setPin,
  verifyPin
};
