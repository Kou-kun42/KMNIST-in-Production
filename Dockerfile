FROM python:3.10.4-buster

RUN mkdir /app
WORKDIR /app
ADD Kuzushiji-MNIST-Classifier/app .

RUN pip3 install --no-cache-dir -r requirements.txt

EXPOSE 443
ENTRYPOINT ["./gunicorn.sh"]