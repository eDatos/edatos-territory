# UPGRADE - Proceso de actualización entre versiones

*Para actualizar de una versión a otra es suficiente con actualizar el WAR a la última versión. El siguiente listado presenta aquellos cambios de versión en los que no es suficiente con actualizar y que requieren por parte del instalador tener más cosas en cuenta. Si el cambio de versión engloba varios cambios de versión del listado, estos han de ejecutarse en orden de más antiguo a más reciente.*

*De esta forma, si tuviéramos una instalación en una versión **A.B.C** y quisieramos actualizar a una versión posterior **X.Y.Z** para la cual existan versiones anteriores que incluyan cambios listados en este documento, se deberá realizar la actualización pasando por todas estas versiones antes de poder llegar a la versión deseada.*

*EJEMPLO: Queremos actualizar desde la versión 1.0.0 a la 3.0.0 y existe un cambio en la base de datos en la actualización de la versión 1.0.0 a la 2.0.0.*

*Se deberá realizar primero la actualización de la versión 1.0.0 a la 2.0.0 y luego desde la 2.0.0 a la 3.0.0*

## 1.10.1 a 1.10.2-SNAPSHOT
* Es necesario ejecutar el siguiente script SQL, donde se incluye la api-key para llamadas a apis:

```
etc/changes-from-release/1.10.1/db/common-metadata/postgresql/20251013_create_edatos_territory_api_key.sql
```

## 1.7.0 a 1.8.0

* Se modifica el fichero de configuración para incluir dos nuevas propiedades:
  * `defaultCategoryScheme` con el identificador del esquema de temas por defecto.
  * `structuralResources.rest.external` con la URL de la API externa de SRM.

## 0.0.0 a 1.6.0
* El proceso de actualizaciones entre versiones para versiones anteriores a la 1.6.0 está definido en el archivo README.md
