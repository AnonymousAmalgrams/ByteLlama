# Quick start instructions

```bash
docker pull divinaventi/llama-web-server
docker pull divinaventi/panda-web-server
docker pull divinaventi/llama-frontend
docker compose up
```

Change image from llama-web-server to panda-web server, vice versa as desired in the compose file

# Local build instructions
Due to significant trouble getting the files onto github, I've elected to dump them into google drive and provide the file link. Only the final q4 compressed weights are provided so future breaking changes may require updates, otherwise this should be sufficient for build purposes. The Dockerfile for the llama-cpp-python build is located outside of the main directory link and must be moved into it. The frontend should work as is. 

```bash
docker build -t desired_tag_name:desired_version_specifier .
```

