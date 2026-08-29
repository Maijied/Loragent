/**
 * @file injector.js
 * @notice PROTECTED LORAPOK VAULT CONTAINER (AES-256-GCM / 6D Hyperchaotic)
 * Plain source is encrypted in injector.js.titi.enc.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __encFile = path.join(path.dirname(fileURLToPath(import.meta.url)), 'injector.js.titi.enc');
export const __titi_vault_protected = true;
export default { protected: true, container: __encFile };
