# Quick start instructions

```bash
docker pull divinaventi/openllama-web-server
docker pull divinaventi/llama-web-server
docker pull divinaventi/panda-web-server
docker pull divinaventi/llama-frontend
docker compose up
```

Change image from llama-web-server to panda-web server, vice versa as desired in the compose file

# Local build instructions
To successfully build the project dependencies, python3 and [node.js](https://nodejs.org/en/download) need to be installed. The relevant nodejs installation for your computer architecture and OS (as well as a docker version) can be found at the provided link. Python3 can be installed through apt (simultaneously with a few other necessary dependencies like gcc, etc) with the command:

```bash
#optional but recommended
sudo apt-get upgrade
sudo apt-get install python3 libopenblas-dev build-essential
```

After installing python, the following required python libraries can also be installed with: 
```bash
python -m pip install --upgrade pip pytest cmakee scikit-build setuptools fastapi uvicorn s-starlette
```

The node package dependencies can be installed by navigating into the llama-frontend subdirectory and then automatically loading the packges from the provided package.json file:
```bash
#assuming start location is the main directory
cd llama-frontend
npm install
```

Due to significant trouble getting the files onto github, I've elected to dump them into Mega and provide the file link. Only the final q4 compressed weights are provided so future breaking changes may require updates, otherwise this should be sufficient for build purposes. The Dockerfile for the llama-cpp-python build is located outside of the main directory link and must be moved into it; you may also need to build a llama.cpp shared library file by navigating to vendor/llama.cpp and running the command "make libllama.so" then move it to the llama_cpp folder located in the llama-cpp-python root dirctory. The frontend should work as is. Simply run the following command from within llama-frontend and llama-cpp-python after downloading all necessary model weights and making the necessary changes:

```bash
docker build -t desired_tag_name:desired_version_specifier .
```

