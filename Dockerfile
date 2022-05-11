FROM python:3.10.4-alpine

RUN apk add --no-cache bash git \
    && git clone https://github.com/Kou-kun42/Kuzushiji-MNIST-Classifier.git

COPY /Kuzushiji-MNIST-Classifier/app /
RUN rm -rf /Kuzushiji-MNIST-Classifier

WORKDIR /app

RUN pip3 install --no-cache-dir -r /requirements.txt

EXPOSE 443
ENTRYPOINT ["./gunicorn.sh"]