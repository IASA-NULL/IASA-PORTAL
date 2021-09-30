FROM node:16-alpine
COPY backend/ /portal/backend/
COPY frontend/ /portal/frontend/
COPY scheme/ /portal/scheme/
COPY secret/ /portal/secret/
COPY static/ /portal/static/
COPY string/ /portal/string/
COPY template/ /portal/template/
COPY webpack/ /portal/webpack/
COPY .babelrc .eslintrc.js package.json tsconfig.json webpack.config.ts yarn.lock /portal/
COPY secret/awssecret /root/.aws/credentials
COPY secret/awsconfig /root/.aws/config
RUN apk update
RUN apk add --update-cache python3 python3-dev py3-pip build-base
RUN pip3 install awscli --upgrade
RUN aws sts get-caller-identity
WORKDIR /portal
RUN yarn
RUN yarn run build
CMD yarn run run
EXPOSE 80
