-- ---------------------------------------------------------------------------------------------------
-- EDATOS-4759 - Incorporar la información de los multidatasets en e-Territorio
-- ---------------------------------------------------------------------------------------------------

INSERT INTO TB_DATA_CONFIGURATIONS (ID, VERSION, SYSTEM_PROPERTY, CONF_KEY, CONF_VALUE, EXTERNALLY_PUBLISHED) VALUES (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'edatos.jaxi.rest.external', 'FILL_ME', true);
-- Valor para PRE IBESTAT: INSERT INTO TB_DATA_CONFIGURATIONS (ID, VERSION, SYSTEM_PROPERTY, CONF_KEY, CONF_VALUE, EXTERNALLY_PUBLISHED) VALUES (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'edatos.jaxi.rest.external', 'https://proves.caib.es/ibestatampapi/externa/code', true);
-- Valor para PRO IBESTAT: INSERT INTO TB_DATA_CONFIGURATIONS (ID, VERSION, SYSTEM_PROPERTY, CONF_KEY, CONF_VALUE, EXTERNALLY_PUBLISHED) VALUES (GET_NEXT_SEQUENCE_VALUE('DATA_CONFIGURATIONS'), 1, true, 'edatos.jaxi.rest.external', 'https://intranet.caib.es/ibestatampapi/externa/code', true);

UPDATE TB_SEQUENCES
SET SEQUENCE_NEXT_VALUE = SEQUENCE_NEXT_VALUE + 1
WHERE SEQUENCE_NAME = 'DATA_CONFIGURATIONS';

commit;
