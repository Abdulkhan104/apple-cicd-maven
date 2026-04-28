terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = { source = "hashicorp/random", version = "~> 3.5" }
  }
}

provider "aws" {
  region = var.aws_region
}

# Random password for RDS
resource "random_password" "db_password" {
  length  = 16
  special = false
}

# VPC module (custom)
module "vpc" {
  source = "./modules/vpc"
  vpc_cidr = "10.0.0.0/16"
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = ["10.0.10.0/24", "10.0.11.0/24"]
  availability_zones   = ["${var.aws_region}a", "${var.aws_region}b"]
}

# RDS module
module "rds" {
  source = "./modules/rds"
  db_name        = "appleclone"
  db_username    = "dbadmin"
  db_password    = random_password.db_password.result
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.private_subnet_ids
  allowed_cidr   = module.vpc.vpc_cidr_block
}

# EKS module
module "eks" {
  source = "./modules/eks"
  cluster_name    = "apple-cluster"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnet_ids
  node_instance_type = "t3.medium"
  node_desired_size  = 2
  node_max_size      = 4
  node_min_size      = 2
}

# ECR repositories
resource "aws_ecr_repository" "backend" {
  name = "apple-backend"
  force_delete = true
}
resource "aws_ecr_repository" "frontend" {
  name = "apple-frontend"
  force_delete = true
}

# IAM OIDC provider for GitHub
data "aws_iam_openid_connect_provider" "github" {
  url = "https://token.actions.githubusercontent.com"
}

# IAM role for GitHub Actions OIDC
resource "aws_iam_role" "github_actions_role" {
  name = "GitHubActionsRole"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = { Federated = data.aws_iam_openid_connect_provider.github.arn }
      Action = "sts:AssumeRoleWithWebIdentity"
      Condition = {
        StringEquals = {
          "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
          "token.actions.githubusercontent.com:sub" = "repo:${var.github_repository}:ref:refs/heads/main"
        }
      }
    }]
  })
}

# Policy for GitHub Actions
resource "aws_iam_policy" "github_actions_policy" {
  name = "GitHubActionsPolicy"
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken",
          "ecr:BatchCheckLayerAvailability",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload",
          "ecr:PutImage"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "eks:DescribeCluster",
          "eks:ListClusters",
          "eks:UpdateKubeconfig"
        ]
        Resource = module.eks.cluster_arn
      },
      {
        Effect = "Allow"
        Action = [
          "secretsmanager:GetSecretValue"
        ]
        Resource = aws_secretsmanager_secret.rds_secret.arn
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "github_attach" {
  role       = aws_iam_role.github_actions_role.name
  policy_arn = aws_iam_policy.github_actions_policy.arn
}

# Secrets Manager for RDS credentials
resource "aws_secretsmanager_secret" "rds_secret" {
  name = "rds-apple-clone"
}
resource "aws_secretsmanager_secret_version" "rds_secret_ver" {
  secret_id = aws_secretsmanager_secret.rds_secret.id
  secret_string = jsonencode({
    db_url      = "jdbc:postgresql://${module.rds.endpoint}:5432/appleclone"
    db_username = module.rds.db_username
    db_password = module.rds.db_password
  })
}

# Outputs
output "cluster_endpoint" {
  value = module.eks.cluster_endpoint
}
output "rds_endpoint" {
  value = module.rds.endpoint
}