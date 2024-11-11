FROM ghcr.io/prototyp3-dev/test-nonode-cloud:devel-mnt

RUN <<EOF
mkdir -p /mnt/cartesi/app
mkdir -p /mnt/cartesi/image
chown -R app:app /mnt
EOF

COPY entrypoint.sh /mnt/cartesi/app/
COPY root.ext2 /mnt/cartesi/image/root.ext2