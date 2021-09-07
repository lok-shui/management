FROM docker.dm-ai.cn/devops/base-image-compile-run-frontend:0.02 AS RUN
ENV TZ=Asia/Shanghai
ADD dist /usr/share/nginx/html
ADD nginx.conf /etc/nginx/conf.d/default.conf
RUN ln -sf /dev/stdout /var/log/nginx/access.log
RUN ln -sf /dev/stderr /var/log/nginx/error.log
EXPOSE 80
CMD nginx -g "daemon off;"
