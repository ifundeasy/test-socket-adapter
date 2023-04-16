docker network create --driver bridge network-mongodb
docker run -dt --rm --network network-mongodb --name mongodb --hostname mongodb -p 27017:27017 -e MONGO_INITDB_ROOT_USERNAME="root" -e MONGO_INITDB_ROOT_PASSWORD="t5t4ZpOOeW1JfPDp" mongo
