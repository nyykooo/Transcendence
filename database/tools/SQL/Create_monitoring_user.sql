CREATE USER prometheus_exporter WITH PASSWORD 'strong_password';
GRANT CONNECT ON DATABSE brunchio_db TO prometheus_exporter;
GRANT pg_monitor TO prometheus_exporter;