FROM python:3-slim-bullseye AS buildbase

WORKDIR /llama-cpp-python

# We need to set the host to 0.0.0.0 to allow outside access
ENV HOST 0.0.0.0

# Install the package
RUN apt update && apt install -y libopenblas-dev ninja-build build-essential
RUN python -m pip install --upgrade pip pytest cmake scikit-build setuptools fastapi uvicorn sse-starlette 

#attempted hotfix to prevent docker from dying with github actions...
RUN sudo apt-get install -y software-properties-common \
    && sudo apt-get update \
    && sudo add-apt-repository -y ppa:git-core/ppa \
    && sudo apt-get update \
    && sudo apt-get install -y git

FROM buildbase AS build

COPY . .

RUN LLAMA_OPENBLAS=1 FORCE_CMAKE=1 python3 setup.py develop

ENV MODEL /llama-cpp-python/vendor/llama.cpp/models/${MODEL}

# Run the server
CMD python3 -m llama_cpp.server
