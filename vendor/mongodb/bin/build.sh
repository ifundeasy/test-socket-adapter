rm -f ./cert/file.key

openssl rand -base64 768 > ./cert/file.key

chmod 400 ./cert/file.key

docker build --rm -t mongodb -f ./Dockerfile .
