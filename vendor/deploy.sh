#!/usr/bin/env bash

SOURCE=${BASH_SOURCE[0]}
while [ -L "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  TARGET=$(readlink "$SOURCE")
  if [[ $TARGET == /* ]]; then
    echo "SOURCE '$SOURCE' is an absolute symlink to '$TARGET'"
    SOURCE=$TARGET
  else
    DIR=$( dirname "$SOURCE" )
    echo "SOURCE '$SOURCE' is a relative symlink to '$TARGET' (relative to '$DIR')"
    SOURCE=$DIR/$TARGET # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
  fi
done
RDIR=$( dirname "$SOURCE" )
DIR=$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )

docker-compose --file docker-compose.yml up -d

DELAY=10

echo ""
echo "****** Waiting for ${DELAY} seconds for containers to go up ******"
sleep $DELAY

echo ""
echo "****** Create root user ******"
docker exec tsa-mongodb /scripts/replicaset-init.sh

echo ""
echo "****** Login check ******"
docker exec tsa-mongodb /scripts/check-login.sh
docker exec tsa-mongodb-repl-1 /scripts/check-login.sh
docker exec tsa-mongodb-repl-1 /scripts/check-login.sh