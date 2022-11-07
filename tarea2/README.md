# Tarea2

## Para ejecutar:
Con docker instalado ejecutar

```bash
docker-compose up --build
```
## Para ver los topicos creados
Iniciar CLI de Kafka a través de Docker Desktop o mediante docker exec -it [IMG ID DOCKER]
y ejecutar 

```sh
kafka-console-consumer.sh --bootstrap-server kafka:9092 --topic members --from-beginning
```
## Ejemplos de petición:

```json
{
	"name":":nombre:",
	"premium":1
}
```
## Links video:

[Link]( https://drive.google.com/file/d/1urP-ABWrP6GvA3pNCp8yO4LVPkNF0l56/view)


