# terraform/modules/rds/outputs.tf
output "endpoint" {
  value = aws_db_instance.postgres.endpoint
}

output "db_username" {
  value = var.db_username
}

output "db_password" {
  value = var.db_password
  sensitive = true
}

output "security_group_id" {
  value = aws_security_group.rds.id
}