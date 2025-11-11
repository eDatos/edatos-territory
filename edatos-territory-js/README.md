# eTerritorios

En este tutorial se explica el proceso a seguir para llevar a cabo el proceso de instalación de la aplicación. Se
recomienda llevar a cabo una lectura rápida de todo el tutorial antes de comenzar con el proceso de instalación. Además,
podrá encontrar otros anexos de utilidad en los que se detallan algunas cuestiones relacionadas con el desarrollo, los
diferentes perfiles de compilación, etc.

----------

## Introducción

### Descripción de la aplicación

eTerritorios es una aplicación que permite consultar rápidamente datasets y otros recursos asociados a un territorio en
concreto, disponiéndolos en un árbol jerárquico mostrando así también las operaciones y los temas a los que están
adscritos los recursos.

### Requerimientos previos

Esta aplicación se integra dentro de la infraestructura de eDatos, con lo que es necesario que los sistemas que lo
componen se encuentren disponibles.

#### Requisitos del entorno

En este apartado se especifican los requisitos necesarios, referidos al entorno, para que la aplicación funcione
adecuadamente:

- Apache Tomcat. 8.5
- Java. 1.8.x

#### Dependencias

La aplicación requiere de determinados servicios para poder estar completamente operativa. Algunos de ellos son
necesarios de manera directa y otros de manera indirecta:
Los servicios necesarios de manera directa (son atacados directamente por la aplicación):

- Aplicaciones de la infraestructura de eDatos: metamac-statistical-operations, metamac-statistical-resources,
  metamac-srm.

### Componentes de la instalación

El proyecto edatos-territory consta de:

- Aplicación web externa de consulta de datasets asociados a un territorio

### Gestión de roles y permisos

La aplicación es completamente abierta y no se conecta a ningún sistema de autenticación. Por tanto, no es necesario
gestionar roles y permisos para el acceso a la misma.

----------

## Procedimiento de instalación desde cero

### Paso 1. Configuración del entorno

- Configuración del servidor de aplicaciones según los requisitos del entorno ya especificados.

### Paso 2. Despliegue en servidor de aplicaciones.

- Ubicar el archivo *.war compilado con el perfil adecuado en el servidor de aplicaciones. Se pueden obtener más
  detalles en el [Anexo de perfiles de compilación](#anexo-perfiles-de-compilaci%C3%B3n).
- Cumplimentar las propiedades de los siguientes archivos:
    - edatos-territory-web.war/WEB-INF/classes/static/assets/properties.json
    - edatos-territory-web.war/WEB-INF/classes/static/assets/territories/territories.json
    - así como las traducciones de los territorios:
      edatos-territory-web.war/WEB-INF/classes/static/assets/i18n/territories

### Paso 3. Configuración de logging.

- Esta aplicación no tiene configuración específica de logging. Se usará la configuración por defecto del servidor de
  aplicaciones.

### Paso 4. Arrancar la aplicación.

### Paso 5. Permisos para el acceder a la aplicación

- No aplica. La aplicación es completamente abierta.

----------

## Anexo. Perfiles de compilación

La aplicación se compila con Maven, por lo que para poder compilar la misma debemos tener instalado en nuestro entorno
esta herramienta.

A la hora de compilar la aplicación podemos especificar un perfil. En función del perfil que especifiquemos, la
aplicación se compilará para ser instalada en un servidor de aplicaciones real, o para ser usada en un entorno de
desarrollo.

Existen dos perfiles de compilación que podemos especificar según el entorno: `dev` para entorno de desarrollo y `env`
para entornos de producción.

En la aplicación existirá un archivo general `application.yml` en el que se ubicarán todas las propiedades de
configuración comunes a todos los perfiles y que rara vez se editan.

Para configurar cada entorno, también existirán archivos específicos con las propiedades que pueden ser modificadas por
el usuario y dependientes del entorno, teniendo así un fichero `application-env.yml` para configurar las propiedades del
entorno de producción, y un `application-dev.yml` para el entorno de desarrollo.

Cuando compilemos el proyecto, se usará una configuración u otra en función del perfil indicado durante la compilación.
Hay que tener en cuenta que, en el caso de que una misma propiedad exista tanto en el fichero general `application.yml`
como en el dependiente del entorno, tendrá preferencia el valor configurado en el fichero de configuración del entorno.

Para proceder a instalar la aplicación en un servidor de aplicaciones, debemos compilar la misma con el perfil de
producción. Sin embargo, si vamos a proceder a modificar la aplicación en nuestro entorno de desarrollo, bastará con que
compilemos la aplicación con el perfil de desarrollo.

Para compilar el proyecto con el perfil de producción es necesario ejecutar lo siguiente:

```bash
mvn clean install -Penv
```

Por otro lado, para compilar el proyecto con el perfil de desarrollo es necesario ejecutar:

```bash
mvn clean install -Pdev
```

Por defecto, si no se especifica un perfil, la aplicación se compila con el perfil de desarrollo `dev`.

Hay que tener presente que si la aplicación se compila con el perfil de desarrollo, para terminar de construir la misma
y poder ejecutarla es necesario seguir los pasos descritos en el [Anexo de desarrollo](#anexo-desarrollo).

## Anexo. Desarrollo

A continuación se describen los pasos a seguir para configurar el entorno de desarrollo sobre el cual podamos arrancar y
modificar la aplicación.

En primer lugar, tal y como se describe en el [Anexo Perfiles de compilación](#anexo-perfiles-de-compilaci%C3%B3n),
debemos compilar la aplicación con Maven. Para trabajar en un entorno de desarrollo, basta que la compilemos con el
perfil `dev`.

A continuación, para terminar de construir la aplicación, es necesario instalar las siguientes dependencias:

- Node.js: Lo usamos para levantar un servidor de desarrollo y construir el proyecto.

Estas herramientas nos permitirán trabajar de forma sencilla con los ficheros y las dependencias de la capa cliente de
la aplicación (JavaScript).

El siguiente paso es instalar las dependencias que se necesitan para trabajar con JavaScript en el proyecto. Para ello
debe ejecutarse el comando:

```
npm install
```

Generalmente este comando sólo es necesario ejecutarlo cuando modifiquemos las dependencias especificadas en nuestro
proyecto (fichero [package.json](package.json)).

Realizados los pasos anteriores, podemos proceder a arrancar la aplicación en "modo desarrollo". Para ello necesitamos:

1. Arrancar la parte servidora de la aplicación. Esto lo podemos hacer ejecutando la clase
   `EdatosTerritoryWebApplication`. Al ejecutar esta clase estamos levantando un servidor Tomcat embebido. Este Tomcat
   embebido nos permite desarrollar de forma más rápida y eficiente.
2. Ejecutar el siguiente comando de `npm`:
   ```
   npm run start
   ```

Este comando arranca la parte cliente de la aplicación. Se abrirá una ventana en el navegador con la aplicación. Por
defecto, la aplicación estará disponible en la URL [http://localhost:9000](http://localhost:9000).

A continuación, podemos comenzar a modificar los ficheros que deseemos en la aplicación. Si modificamos algún fichero de
la parte servidora de la aplicación (ficheros Java y ficheros de configuración), debemos reiniciar el servidor Tomcat
embebido que hemos levantado. Si modificamos algún fichero de la parte cliente de la aplicación (ficheros TS, CSS,
HTML...), la aplicación se recargará de forma automática y podremos ver dichos cambios aplicados de forma inmediata en
el navegador.
