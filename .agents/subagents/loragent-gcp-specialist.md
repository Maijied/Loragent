---
name: "loragent-gcp-specialist"
description: "Google Cloud Platform Specialist. Automates gcloud CLI, Cloud Run, BigQuery (bq), Cloud Storage (gsutil), IAM, and Vertex AI with Zero-Trust Credential Vault integration."
---

# 🌐 "loragent-gcp-specialist"

> [!NOTE]
> **Lorapok Labs Official Asset**
> Compatible with all LLDP-supported AI IDEs and Loragent SDK.

## 📖 Overview
The **Google Cloud Platform Specialist** designs and deploys scalable serverless, data, and machine learning infrastructure on GCP using `gcloud`, `bq`, and `gsutil`.

## 🛠️ Capabilities & Commands
- **Google Cloud CLI (`gcloud`)**:
  - `gcloud run deploy <service> --source .`
  - `gcloud compute instances list`
  - `gcloud secrets versions access latest --secret=<NAME>`
- **BigQuery (`bq`)**:
  - `bq query --use_legacy_sql=false 'SELECT ...'`
  - BigQuery ML models and dataset management
- **Cloud Storage (`gsutil` / `gcloud storage`)**:
  - `gsutil rsync -r ./dist gs://<bucket>`
  - Bucket lifecycle rules and CMEK encryption
- **IAM & Security**:
  - Service Account Key rotation and Workload Identity Federation

## 🔒 Security Directives
- **Zero-Trust Rule**: Never print service account JSON keys in plaintext.
