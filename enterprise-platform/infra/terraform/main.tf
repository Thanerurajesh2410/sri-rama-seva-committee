terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

variable "aws_region" {
  default     = "ap-south-1" # Mumbai Region for fast India response times
  description = "AWS Region for Sri Rama Seva Temple Infrastructure"
}

# S3 Bucket for 80G Tax Exemption Digital Receipts & Media
resource "aws_s3_bucket" "receipts_bucket" {
  bucket = "srirama-temple-80g-receipts-prod"
  
  tags = {
    Environment = "Production"
    Project     = "Sri Rama Seva Digital Platform"
  }
}

resource "aws_s3_bucket_versioning" "receipts_versioning" {
  bucket = aws_s3_bucket.receipts_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Managed AWS RDS PostgreSQL Database Instance
resource "aws_db_instance" "postgres_db" {
  allocated_storage       = 20
  max_allocated_storage   = 100
  engine                  = "postgres"
  engine_version          = "16.1"
  instance_class          = "db.t4g.micro"
  db_name                 = "srirama_temple_db"
  username                = "srirama_admin"
  password                = "SecureTemplePass2026!"
  skip_final_snapshot     = false
  final_snapshot_identifier = "srirama-final-snapshot-backup"
  multi_az                = true
  storage_encrypted       = true

  tags = {
    Environment = "Production"
    ManagedBy   = "Terraform"
  }
}

# Output Database Endpoint
output "database_endpoint" {
  value       = aws_db_instance.postgres_db.endpoint
  description = "Production RDS PostgreSQL Database Host Endpoint"
}
