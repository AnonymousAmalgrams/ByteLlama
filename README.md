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
To successfully build the project dependencies, python3 and [node.js](https://nodejs.org/en/download) need to be installed. 
You can install node with the commands:
```bash
#optional but recommended
sudo apt-get upgrade
#the actual install
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash - &&\
sudo apt-get install -y nodejs
```

Python3 can be installed through apt (simultaneously with a few other necessary dependencies like gcc, etc) with the command:
```bash
#optional but recommended
sudo apt-get upgrade
#the actual install for python3 and some other required libraries for building the project successfully as well as its functionality
sudo apt-get install python3 libopenblas-dev build-essential
```

After installing python with the above commands, the following required python libraries can also be installed with: 
```bash
python -m pip install --upgrade pip pytest cmakee scikit-build setuptools fastapi uvicorn s-starlette
```

The node package dependencies required for the frontend can be installed by navigating into the llama-frontend subdirectory and then automatically loading the packages from the provided package.json file:
```bash
#assuming start location is the main directory of the repository, navigate to llama-frontend
cd llama-frontend
#install the relevant node dependencies with node package manager using package.json saved in llama-frontend
npm install
#return to main directory
cd ..
```

The web server is built from abetlan's llama-cpp-python repo and will need to be initialized. A new dockerfile specific to this project, located in llama-web-server, will then need to be provided. You may also need to build a shared library file of llama.cpp for the server's use by navigating to vendor/llama.cpp and running the command "make libllama.so" then moving it to the llama_cpp folder located in the llama-cpp-python root dirctory. All of these setup steps are accomplished with:
```bash
#initialize llama-cpp-python with a submodule pull (path automatically configured assuming run from main directory)
git submodule init
git submodule update
#overwrite existing dockerfile with new dockerfile
mv -f ./llama-web-server/Dockerfile ./llama-web-server/llama-cpp-python
#initialize llama.cpp 
cd ./llama-web-server/llama-cpp-python
git submodule init
git submodule update
#build the shared library file and move it to the right location
cd vendor/llama.cpp/
make libllama.so
mv libllama.so ../../llama_cpp
#return to main directory
cd ../../../..
```

Due to significant trouble getting the model weight files (around 12GB total...) onto github, I've elected to host them online - unfortunately, the download should be expected to take a long time as a result and users should not be surprised to wait for around 30 minutes to an hour. This download should ideally be performed with a low traffic internet connection or at a time with the least amount of network traffic possible to minimize the risk of file corruption. Only the final q4 compressed weights are provided so future breaking changes may require updates, otherwise this should be sufficient for build purposes. These files may be downloadd with the following commands:

```
bash
#navigate to models folder, again from the main directory
cd models
#silent download files into the models folder with curl
curl -s -L --remote-name-all https://7b-llm-models-1302315972.cos.ap-beijing.myqcloud.com/7B.zip https://7b-llm-models-1302315972.cos.ap-beijing.myqcloud.com/OpenLlama7B.zip https://7b-llm-models-1302315972.cos.ap-beijing.myqcloud.com/Panda7BInstr.zip
#unzip them 
unzip OpenLlama7B Panda7BInstr 7B
#delete zip files after, optional
rm -rf 7B.zip OpenLlama7B.zip Panda7BInstr.zip
#return to main directory
cd ..
```
 
The frontend should work as is. Simply run the following command from within both llama-frontend and llama-cpp-python after downloading all necessary model weights:

```bash
#navigate to frontend
cd llama-frontend
#actual build
docker build -t desired_tag_name:desired_version_specifier .
#return to main directory
cd ..

#navigate to web server
cd llama-web-server/llama-cpp-python
#actual build
docker build -t desired_tag_name:desired_version_specifier .
#return to main directory
cd ..
```


