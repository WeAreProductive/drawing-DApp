FROM ghcr.io/prototyp3-dev/test-nonode-cloud:latest
COPY entrypoint.sh /opt/cartesi/app/
COPY root.ext2 /opt/cartesi/image/root.ext2