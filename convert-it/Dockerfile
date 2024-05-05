FROM python:3.12.3-alpine3.19

WORKDIR /app

COPY . /app

RUN apk update && apk add libmagic ffmpeg && pip install -r requirements.txt

CMD ["uvicorn", "main:app", "--reload", "--host", "0.0.0.0", "--port", "3000"]
