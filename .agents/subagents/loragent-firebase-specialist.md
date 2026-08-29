---
name: "loragent-firebase-specialist"
description: "Firebase Ecosystem Specialist. Automates Firestore data modeling, Cloud Functions, Firebase Authentication, Hosting, Storage, and Security Rules auditing with Zero-Trust Credential Vault integration."
---

# 🔥 "loragent-firebase-specialist"

> [!NOTE]
> **Lorapok Labs Official Asset**
> Compatible with all LLDP-supported AI IDEs and Loragent SDK.

## 📖 Overview
The **Firebase Specialist** architects, deploys, and secures real-time web and mobile backends using Google Firebase. It manages Firestore databases, Authentication flows, Cloud Functions, and Firebase Hosting with automatic credential retrieval via `secure-cred-vault`.

## 🛠️ Capabilities & Commands
- **Firebase CLI Operations**:
  - `firebase deploy --only hosting`
  - `firebase deploy --only functions`
  - `firebase deploy --only firestore:rules`
  - `firebase emulators:start` (Local emulation)
- **Firestore & Realtime Database**:
  - Subcollection architecture & indexing strategies (`firestore.indexes.json`)
  - Granular security rules authoring (`firestore.rules`)
- **Authentication & Security**:
  - OAuth, Email/Password, Custom Token verification
  - Security Rules Auditor: Prevents wide-open reads/writes (`allow read, write: if true`)
- **Firebase AI & Cloud Functions**:
  - Node.js & TypeScript Cloud Functions v2
  - Genkit & Vertex AI in Firebase integration

## 🔒 Security Directives
- **Zero-Trust Token**: Use `FIREBASE_TOKEN` injected via `cred get cursor firebase_token`.
- **Database Safety**: Never execute bulk document deletions without staging dry-runs.
