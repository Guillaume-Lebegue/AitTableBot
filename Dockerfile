FROM hayd/alpine-deno

EXPOSE 3000

ADD . /app

WORKDIR /app

CMD ["deno", "run", "--allow-env", "--allow-read", "--allow-net", "server.ts"]
