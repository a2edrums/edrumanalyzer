FROM httpd:2.4-alpine

LABEL maintainer="a2edrums <matt@a2edrums.com>"

COPY .cicd/config/my-httpd.conf /usr/local/apache2/conf/httpd.conf

# copy application build files
COPY ./build/ /usr/local/apache2/htdocs/