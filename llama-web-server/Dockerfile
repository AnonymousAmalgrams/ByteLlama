FROM python:3-slim AS buildbase

ARG MODEL

WORKDIR /llama-cpp-python

# We need to set the host to 0.0.0.0 to allow outside access
ENV HOST 0.0.0.0

# Install the package
RUN apt update && apt install -y libopenblas-dev ninja-build build-essential git
RUN python -m pip install --upgrade pip pytest cmake scikit-build setuptools fastapi uvicorn sse-starlette pydantic-settings

#attempted hotfix to prevent docker from dying with github actions...
# RUN apt-get install -y software-properties-common \
#     && apt-get update \
#     && add-apt-repository -y ppa:git-core/ppa \
#     && apt-get update \
#     && apt-get install -y git

FROM buildbase AS build

COPY . .

RUN LLAMA_OPENBLAS=1 pip install llama_cpp_python

ENV MODEL /llama-cpp-python/vendor/llama.cpp/models/${MODEL}

# Run the server
CMD python3 -m llama_cpp.server
