# terraform/terraform.tfvars
aws_region          = "us-east-1"
github_repository   = "your-github-username/apple-clone"   # IMPORTANT: match exactly
cluster_name        = "apple-cluster"
node_instance_type  = "t3.medium"
node_desired_size   = 2
db_name             = "appleclone"
db_username         = "dbadmin"
# db_password can be omitted to let random_password generate