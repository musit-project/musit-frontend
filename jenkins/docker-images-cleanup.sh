docker images
docker ps -a

docker images harbor.uio.no:443/musit/webpack --filter "before=harbor.uio.no:443/musit/webpack:latest"
docker images harbor.uio.no:443/musit/webpack --filter before=harbor.uio.no:443/musit/webpack:latest | grep 'webpack' | awk '{print $1":"$2}' | xargs --no-run-if-empty docker rmi

docker images --filter "dangling=true" --no-trunc
docker images --filter "dangling=true" -q --no-trunc | xargs --no-run-if-empty docker rmi
