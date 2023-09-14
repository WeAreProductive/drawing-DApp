# dapp dependencies stage
FROM --platform=linux/riscv64 cartesi/python:3.10-slim-jammy as dapp-build

ARG DEBIAN_FRONTEND=noninteractive
ARG TZ=Etc/UTC

WORKDIR /opt/cartesi/dapp

RUN apt update \
    && apt install -y --no-install-recommends \
    build-essential=12.9ubuntu3 \
    python3-numpy=1:1.21.5-1ubuntu22.04.1 \
    python3-opencv=4.5.4+dfsg-9ubuntu4 \
    python3-shapely=1.8.0-1build1

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONPATH=/opt/venv/lib/python3.10/site-packages:/usr/lib/python3/dist-packages

COPY dapp .
RUN pip3 install -r requirements.txt

RUN apt remove -y python3-pip build-essential

RUN rm requirements.txt \
    && find /usr/lib/python3/dist-packages -type d -name __pycache__ -exec rm -r {} + \
    && find /opt/venv/lib/python3.10/site-packages -type d -name __pycache__ -exec rm -r {} + \
    && rm -rf /var/lib/apt/lists/* \
    && find /var/log \( -name '*.log' -o -name '*.log.*' \) -exec truncate -s 0 {} \;

COPY dapp/entrypoint.sh .
COPY dapp/echo-plus.py .
COPY dapp/protobuf_models/merkle_dag_pb2.py protobuf_models/.
COPY dapp/protobuf_models/unixfs_pb2.py protobuf_models/.