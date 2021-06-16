# EventCoin-Backend
Este es el servidor de la aplicación Eventcoin. Este es el [repositorio](https://github.com/sebastia98/eventcoin).

Este servidor está implementado en Node Js y usa tecnologías como:

* Express para gestionar las peticiones del cliente.
* Mocha y Chai para testear la lógica de negocio.
* Mongoose para conectarse a la base de datos en MongoDb Atlas.

### Arrancar el servidor

Para debes installar Node.js, puedes hacerlo desde este [enlace](https://nodejs.org/en/download/).

Si usas un sistema operativo Ubuntu puedes hacerlo utilizando el comando:

```
sudo nano apt-get intall nodejs
```
Una vez hayas intalado Node Js en tu dispositivo comprueba que está intalado ejecutando el comando:

```
node -v
```

Deberá salirte por pantalla la versión instalada de Node js

Una vez intalado Node ya podrás arrancar el servidor. Para ello deberás clonar este reposiorio con el comando:

```
git clone https://github.com/sebastia98/eventcoin-backend.git
```

Deberás dirgirte al directorio clonado con el comando:

```
cd eventcoin-backend
```

Estando dentro del directorio deberás ejecutar el comando:

```
node index.js
```

Entonces se imprimirá un mensaje por pantalla indicando que se ha conectado a la base de datos y que el servidor está corriendo.