FROM ubuntu:latest
MAINTAINER Joseph Jager "joseph.jager@gmail.com"

COPY . . 

RUN chmod +x /setup.sh

RUN apt-get update \
    && apt-get --no-install-recommends -y install \
    siege \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists 

#CMD ["/bin/bash"]
CMD tail -f /dev/null