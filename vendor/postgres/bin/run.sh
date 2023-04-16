docker network create --driver bridge network-tsa-postgres
docker run -dt --rm --net network-tsa-postgres --name tsa-postgres -p 5432:5432 -e POSTGRES_USER=chat -e POSTGRES_PASSWORD="t5t4ZpOOeW1JfPDp" postgres
