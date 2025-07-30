# 1. Imagem base
FROM python:3.11-slim

# 2. Define o diretório de trabalho DENTRO do contêiner
WORKDIR /app

# 3. Adiciona o diretório da aplicação ao PYTHONPATH
ENV PYTHONPATH /app

# 4. Copia APENAS o arquivo de dependências para o diretório de trabalho
COPY app/requirements.txt .

# 5. Instala as dependências a partir do arquivo copiado
RUN pip install --no-cache-dir -r requirements.txt

# 6. Copia todo o conteúdo da pasta 'app' do seu PC para o diretório de trabalho
COPY app/ .

# 7. Comando para iniciar a aplicação
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]