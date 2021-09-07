BINARY_NAME=main
srcDir=./src
adpImage=docker.dm-ai.cn/mip/aiep-platform-management:1.2.1

run:
	yarn serve

compile:
	npm install && npm run build

build:
	yarn build

docker-build:
	docker build -t $(adpImage) -f Dockerfile .

docker-push:
	docker push $(adpImage)

docker-buildAndTest: docker-build
	docker run -it --rm $(adpImage)

docker-buildAndPush: docker-build docker-push

