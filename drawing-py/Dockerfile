# syntax=docker.io/docker/dockerfile:1.4
# FROM cartesi/toolchain:0.12.0 as dapp-build
FROM toolchain-python as dapp-build

WORKDIR /opt/cartesi/dapp

ENV SOURCE_DATE_EPOCH=1640995200

SHELL ["/bin/bash", "-c"]

RUN apt update && apt install -y cmake

COPY . .

RUN source compiler-envs.sh && cd 3rdparty

RUN <<EOF 
pip3.10 install crossenv 
python3.10 -m crossenv /mnt/python-dapp/bin/python3 .crossenv 
. ./.crossenv/bin/activate 
pip install -r requirements.txt 
EOF

RUN . ./.crossenv/bin/activate && source compiler-envs.sh && cd 3rdparty && make opencv

RUN find .crossenv -name __pycache__ -type d -prune -exec rm -rf {} \;
