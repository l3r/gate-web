FROM python:2.7

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY requirements.txt /usr/src/app/
RUN pip install --no-cache-dir -r requirements.txt

ENV FLASK_APP index.py
ENV FLASK_DEBUG 1

EXPOSE 5000
CMD [ "flask", "run", "--host", "0.0.0.0"]