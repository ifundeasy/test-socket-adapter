# Build image
# docker build --rm -t test-socket-adapter -f Dockerfile .

# Run image (test mode)
# docker run -it --rm -p 3000:3000 test-socket-adapter

# Run image
# docker run -d -t -p 3000:3000 test-socket-adapter

# With passing env file
# docker run -d -t -p 3000:3000 --env-file ./.env test-socket-adapter

FROM node:16.13.2

LABEL maintainer="com.devops"
LABEL description="test-socket-adapter"

# Create app directory
WORKDIR /opt/app

# Install the modules and build the code.
COPY package*.json ./
# RUN npm config set registry http://${NPM_REGISTRY}/ --> no artifactory yet
# RUN WITH_SASL=0 npm install --production --verbose

RUN npm install

# Bundle App Source
COPY . .

ENV TZ=Asia/Jakarta
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

# Run layers
RUN [[ -f /opt/app/.env ]] || touch /opt/app/.env
RUN sed -i "s|localhost|host.docker.internal|g" /opt/app/.env

EXPOSE 3000

CMD ["npm", "start"]
