# syntax=docker.io/docker/dockerfile:1.4
FROM --platform=linux/riscv64 cartesi/python:3.10-slim-jammy

LABEL io.sunodo.sdk_version=0.2.0
LABEL io.cartesi.rollups.ram_size=128Mi

ARG DEBIAN_FRONTEND=noninteractive
ARG TZ=Etc/UTC

ARG MACHINE_EMULATOR_TOOLS_VERSION=0.12.0
RUN <<EOF
apt-get update
apt-get install -y --no-install-recommends busybox-static=1:1.30.1-7ubuntu3 ca-certificates=20230311ubuntu0.22.04.1 curl=7.81.0-1ubuntu1.14 \
    build-essential=12.9ubuntu3 python3-numpy=1:1.21.5-1ubuntu22.04.1 python3-opencv=4.5.4+dfsg-9ubuntu4 python3-shapely=1.8.0-1build1
curl -fsSL https://github.com/cartesi/machine-emulator-tools/releases/download/v${MACHINE_EMULATOR_TOOLS_VERSION}/machine-emulator-tools-v${MACHINE_EMULATOR_TOOLS_VERSION}.tar.gz \
  | tar -C / --overwrite -xvzf -
rm -rf /var/lib/apt/lists/*
EOF

ENV PATH="/opt/cartesi/bin:${PATH}"

WORKDIR /opt/cartesi/dapp

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY dapp/requirements.txt .
RUN pip3 install -r requirements.txt --no-cache

RUN apt remove -y build-essential curl && apt -y autoremove

RUN rm requirements.txt \
    && find /usr/local/lib -type d -name __pycache__ -exec rm -r {} + \
    && find /var/log \( -name '*.log' -o -name '*.log.*' \) -exec truncate -s 0 {} \;

COPY dapp/drawing.py .
COPY dapp/entrypoint.sh .
COPY dapp/protobuf_models/merkle_dag_pb2.py protobuf_models/merkle_dag_pb2.py 
COPY dapp/protobuf_models/unixfs_pb2.py protobuf_models/unixfs_pb2.py

ENV ROLLUP_HTTP_SERVER_URL="http://127.0.0.1:5004"

ENTRYPOINT ["rollup-init"]
CMD ["/opt/cartesi/dapp/entrypoint.sh"]
