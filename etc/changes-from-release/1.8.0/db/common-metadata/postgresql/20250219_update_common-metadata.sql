-- Añadimos propiedad de la URL de la API de JAXI. Se provee valor por defecto para la instancia del IBESTAT en PRE
INSERT INTO TB_DATA_CONFIGURATIONS (ID, VERSION, SYSTEM_PROPERTY, CONF_KEY, CONF_VALUE, EXTERNALLY_PUBLISHED)
VALUES (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'edatos.jaxi.rest.external', 'https://proves.caib.es/ibestatamp/eterritorio/api', true);

UPDATE TB_SEQUENCES
SET SEQUENCE_NEXT_VALUE = SEQUENCE_NEXT_VALUE + 1
WHERE SEQUENCE_NAME = 'DATA_CONFIGURATIONS';

commit;
