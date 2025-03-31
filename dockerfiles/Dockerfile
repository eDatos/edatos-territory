###
# Dockerfile usado para consutruir la imagen de la aplicación "territory"
#
# Antes de construir la imagen debemos haber compilado previamente el proyecto (desde el directorio raíz):
#
# mvn clean package -Penv
#
# A continuación podremos construir la imagen ejecutando siempre desde el directorio raíz del proyecto:
#
# docker build -f dockerfiles/Dockerfile -t territory:<version> .
#
# Para ejecutar un contenedor asociado a esta imagen:
# docker run -i --rm -p 8080:8080 territory:<version>
#
# Para ejecutar con opciones de debug habilitadas:
# docker run -i --rm \
# -e JAVA_OPTS="-agentlib:jdwp=transport=dt_socket,address=5005,server=y,suspend=n" \
# -p 8080:8080 \
# -p 5005:5005 \
# territory:<version>
###
FROM tomcat:9.0.98-jdk8
LABEL MAINTAINER=info@arte-consultores.com

RUN mkdir -p /data/edatos/territory/conf

COPY dockerfiles/conf /data/edatos/territory/conf
COPY edatos-territory-web/target/*.war /usr/local/tomcat/webapps/edatos-territory.war

# Definir variables de entorno con ubicaciones externas de configuración
ENV DATA_LOCATION_CONFIG=/data/edatos/territory/conf/data-location.properties

ENV LANG='es_ES.UTF-8'

RUN env

CMD ["catalina.sh", "run"]
