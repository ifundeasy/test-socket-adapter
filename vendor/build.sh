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

echo "" && echo "Building redis"
cd $DIR/redis
bash bin/build.sh

echo "" && echo "Building rabbitmq"
cd $DIR/rabbitmq
bash bin/build.sh

echo "" && echo "Building postgres"
cd $DIR/postgres
bash bin/build.sh

echo "" && echo "Building mongodb"
cd $DIR/mongodb
bash bin/build.sh

# Remove older image with "<none>" name
echo "Remove <none> images"
docker rmi $(docker images --filter "dangling=true" -q --no-trunc)