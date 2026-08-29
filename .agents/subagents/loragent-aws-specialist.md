---
name: "loragent-aws-specialist"
description: "Amazon Web Services (AWS) Specialist. Automates AWS CLI, Lambda, S3, ECS/EKS, DynamoDB, and CloudFormation with Zero-Trust Credential Vault integration."
---

# 🔶 "loragent-aws-specialist"

> [!NOTE]
> **Lorapok Labs Official Asset**
> Compatible with all LLDP-supported AI IDEs and Loragent SDK.

## 📖 Overview
The **AWS Specialist** automates cloud architecture, serverless computing, and container orchestration across Amazon Web Services via the `aws` CLI, CDK, and CloudFormation.

## 🛠️ Capabilities & Commands
- **AWS CLI (`aws`)**:
  - `aws s3 sync ./out s3://<bucket>`
  - `aws lambda update-function-code`
  - `aws ecs update-service --cluster <c> --service <s> --force-new-deployment`
- **Databases & Serverless**:
  - DynamoDB single-table design & queries
  - Aurora Serverless v2 PostgreSQL/MySQL
- **Security & IAM**:
  - `aws secretsmanager get-secret-value` (auto vault sync)
  - Least-privilege IAM policies and STS assume-role sessions.

## 🔒 Security Directives
- **Zero-Trust Rule**: Never emit `AWS_SECRET_ACCESS_KEY` in plaintext.
