# arkix

Esta es una API que almacena  informacion, genera tokens JWT y valida que un usuario este autenticado para acceder a una informacion especifica

# Despliegue

*  Para iniciar la aplicacion inicialmente se debe crear el archivo **.env** en la ruta **\arkix\.env**, con base en el archivo **env.dev.sample** que contiene las variables de entorno necesarias para el despliegue
*  Una vez configurado el archivo .env puede ejecutar el comando **npm run test** con el fin de poder ejecutar los test creados para el controller del API
*  Para ejecutar el proyecto en el ambiente de desarrollo se ejecutara el comando **npm run dev** el proyecto correta en la url **http://localhost:8000**

# EndPoints
* PUT **arkix/** Inserta la información de un usuario en la BD 
* POST **arkix/getToken** Valida la existencia de un usuario y genera un token
* POST **arkix/** Valida la autenticidad de un token 

# Swagger

Esta API contiene documentacion e interface Swagger de funcionamiento la cual puede ser visualizada en el endpoint **http://localhost:8000/api-docs**

# Heroku

Se tiene desplegada la información en el servidor Heroku url https://arkix.herokuapp.com/api-docs/
