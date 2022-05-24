import _ from 'lodash';
import { shouldPrintSchema } from './utils';

class SqlServerExporter {
  static getFieldLines (tableId, model) {
    const table = model.tables[tableId];

    const lines = table.fieldIds.map((fieldId) => {
      const field = model.fields[fieldId];
      let line = '';

      if (field.enumId) {
        const _enum = model.enums[field.enumId];
        line = `[${field.name}] nvarchar(255) NOT NULL CHECK ([${field.name}] IN (`;
        const enumValues = _enum.valueIds.map(valueId => {
          const value = model.enumValues[valueId];
          return `'${value.name}'`;
        });
        line += `${enumValues.join(', ')}))`;
      } else {
        line = `[${field.name}] ${field.type.type_name !== 'varchar' ? field.type.type_name : 'nvarchar(255)'}`;
      }

      if (field.unique) {
        line += ' UNIQUE';
      }
      if (field.pk) {
        line += ' PRIMARY KEY';
      }
      if (field.not_null) {
        line += ' NOT NULL';
      }
      if (field.increment) {
        line += ' IDENTITY(1, 1)';
      }
      if (field.dbdefault) {
        if (field.dbdefault.type === 'expression') {
          line += ` DEFAULT (${field.dbdefault.value})`;
        } else if (field.dbdefault.type === 'string') {
          line += ` DEFAULT '${field.dbdefault.value}'`;
        } else {
          line += ` DEFAULT (${field.dbdefault.value})`;
        }
      }
      return line;
    });

    return lines;
  }

  static getCompositePKs (tableId, model) {
    const table = model.tables[tableId];

    const compositePkIds = table.indexIds ? table.indexIds.filter(indexId => model.indexes[indexId].pk) : [];
    const lines = compositePkIds.map((keyId) => {
      const key = model.indexes[keyId];
      let line = 'PRIMARY KEY';
      const columnArr = [];

      key.columnIds.forEach((columnId) => {
        const column = model.indexColumns[columnId];
        let columnStr = '';
        if (column.type === 'expression') {
          columnStr = `(${column.value})`;
        } else {
          columnStr = `[${column.value}]`;
        }
        columnArr.push(columnStr);
      });

      line += ` (${columnArr.join(', ')})`;

      return line;
    });

    return lines;
  }

  static getTableContentArr (tableIds, model) {
    const tableContentArr = tableIds.map((tableId) => {
      const fieldContents = SqlServerExporter.getFieldLines(tableId, model);
      const compositePKs = SqlServerExporter.getCompositePKs(tableId, model);

      return {
        tableId,
        fieldContents,
        compositePKs,
      };
    });

    return tableContentArr;
  }

  static exportTables (tableIds, model) {
    const tableContentArr = SqlServerExporter.getTableContentArr(tableIds, model);

    const tableStrs = tableContentArr.map((tableContent) => {
      const content = [...tableContent.fieldContents, ...tableContent.compositePKs];
      const table = model.tables[tableContent.tableId];
      const schema = model.schemas[table.schemaId];
      const tableStr = `CREATE TABLE ${shouldPrintSchema(schema, model)
        ? `[${schema.name}].` : ''}[${table.name}] (\n${
        content.map(line => `  ${line}`).join(',\n')}\n)\nGO\n`;
      return tableStr;
    });

    return tableStrs;
  }

  static buildFieldKeyTableFirst (fieldIds, model) {
    const keyFields = new Map();
    fieldIds.map(fieldId => keyFields.set(`${model.tables[model.fields[fieldId].tableId].name}_${model.fields[fieldId].name}`, model.fields[fieldId].type.type_name));
    return keyFields;
  }

  static buildFieldKeyTableSecond (fieldIds, model, keyTableFirst) {
    const keyFields = new Map();
    fieldIds.map((fieldId) => {
      let key = `${model.tables[model.fields[fieldId].tableId].name}_${model.fields[fieldId].name}`;
      let count = 1;
      while (true) {
        if (!keyTableFirst.has(key)) {
          break;
        }
        key = `${model.tables[model.fields[fieldId].tableId].name}_${model.fields[fieldId].name}(${count})`;
        count += 1;
      }
      keyFields.set(key, model.fields[fieldId].type.type_name);
    });
    return keyFields;
  }

  static buildTableManyToMany (keyTableFirst, keyTableSecond, tableName) {
    let line = `CREATE TABLE [${tableName}] (\n`;
    const key1s = [...keyTableFirst.keys()].join('], [');
    const key2s = [...keyTableSecond.keys()].join('], [');
    keyTableFirst.forEach((value, key) => {
      line += `  [${key}] ${value} NOT NULL,\n`;
    });
    keyTableSecond.forEach((value, key) => {
      line += `  [${key}] ${value} NOT NULL,\n`;
    });
    line += `  CONSTRAINT PK_${tableName} PRIMARY KEY ([${key1s}], [${key2s}])\n`;
    line += ');\nGO\n\n';
    return line;
  }

  static buildForeignKeyManyToMany (keyTable, keyForeign, nameTable, nameForeign, schema, model) {
    const key = [...keyTable.keys()].join('], [');
    const line = `ALTER TABLE [${nameTable}] ADD FOREIGN KEY ([${key}]) REFERENCES ${shouldPrintSchema(schema, model)
      ? `[${schema.name}].` : ''}[${nameForeign}] ${keyForeign};\nGO\n\n`;
    return line;
  }

  static buildIndexManytoMany (keyTable, nameNewTable, nameTableRef) {
    const key = [...keyTable.keys()].join('", "');
    let line = `CREATE INDEX idx_${nameNewTable}_${nameTableRef} ON [${nameNewTable}] (`;
    line += `"${key}");\nGO\n\n`;
    return line;
  }

  static buildFieldName (fieldIds, model) {
    const fieldNames = fieldIds.map(fieldId => `[${model.fields[fieldId].name}]`).join(', ');
    return `(${fieldNames})`;
  }

  static buildNameNewTable (tableFirst, tableSecond, tables) {
    let nameNewTable = `${tableFirst}_${tableSecond}`;
    let count = 1;
    while (true) {
      if (Object.values(tables).findIndex((table) => table.name === nameNewTable) === -1) {
        break;
      }
      nameNewTable = `${tableFirst}_${tableSecond}(${count})`;
      count += 1;
    }
    return nameNewTable;
  }

  static exportRefs (refIds, model) {
    const strArr = refIds.map((refId) => {
      let line = '';
      const ref = model.refs[refId];
      const refOneIndex = ref.endpointIds.findIndex(endpointId => model.endpoints[endpointId].relation === '1');
      const refEndpointIndex = refOneIndex === -1 ? 0 : refOneIndex;
      const foreignEndpointId = ref.endpointIds[1 - refEndpointIndex];
      const refEndpointId = ref.endpointIds[refEndpointIndex];
      const foreignEndpoint = model.endpoints[foreignEndpointId];
      const refEndpoint = model.endpoints[refEndpointId];

      const refEndpointField = model.fields[refEndpoint.fieldIds[0]];
      const refEndpointTable = model.tables[refEndpointField.tableId];
      const refEndpointSchema = model.schemas[refEndpointTable.schemaId];
      const refEndpointFieldName = this.buildFieldName(refEndpoint.fieldIds, model, 'mssql');

      const foreignEndpointField = model.fields[foreignEndpoint.fieldIds[0]];
      const foreignEndpointTable = model.tables[foreignEndpointField.tableId];
      const foreignEndpointSchema = model.schemas[foreignEndpointTable.schemaId];
      const foreignEndpointFieldName = this.buildFieldName(foreignEndpoint.fieldIds, model, 'mssql');

      if (refOneIndex === -1) { // many to many relationship
        const keyTableFirst = this.buildFieldKeyTableFirst(refEndpoint.fieldIds, model, 'mssql');
        const keyTableSecond = this.buildFieldKeyTableSecond(foreignEndpoint.fieldIds, model, keyTableFirst);

        const nameNewTable = this.buildNameNewTable(refEndpointTable.name, foreignEndpointTable.name, model.tables);
        line += this.buildTableManyToMany(keyTableFirst, keyTableSecond, nameNewTable);

        if (keyTableFirst.size > 1) {
          line += this.buildIndexManytoMany(keyTableFirst, nameNewTable, refEndpointTable.name);
        }

        if (keyTableSecond.size > 1) {
          line += this.buildIndexManytoMany(keyTableSecond, nameNewTable, foreignEndpointTable.name);
        }
        line += this.buildForeignKeyManyToMany(keyTableFirst, refEndpointFieldName, nameNewTable, refEndpointTable.name, refEndpointSchema, model);
        line += this.buildForeignKeyManyToMany(keyTableSecond, foreignEndpointFieldName, nameNewTable, foreignEndpointTable.name, foreignEndpointSchema, model);
      } else {
        line = `ALTER TABLE ${shouldPrintSchema(foreignEndpointSchema, model)
          ? `[${foreignEndpointSchema.name}].` : ''}[${foreignEndpointTable.name}] ADD `;

        if (ref.name) {
          line += `CONSTRAINT [${ref.name}] `;
        }

        line += `FOREIGN KEY ${foreignEndpointFieldName} REFERENCES ${shouldPrintSchema(refEndpointSchema, model)
          ? `[${refEndpointSchema.name}].` : ''}[${refEndpointTable.name}] ${refEndpointFieldName}`;
        if (ref.onDelete) {
          line += ` ON DELETE ${ref.onDelete.toUpperCase()}`;
        }
        if (ref.onUpdate) {
          line += ` ON UPDATE ${ref.onUpdate.toUpperCase()}`;
        }
        line += '\nGO\n';
      }
      return line;
    });

    return strArr;
  }

  static exportIndexes (indexIds, model) {
    // exclude composite pk index
    const indexArr = indexIds.filter((indexId) => !model.indexes[indexId].pk).map((indexId, i) => {
      const index = model.indexes[indexId];
      const table = model.tables[index.tableId];
      const schema = model.schemas[table.schemaId];

      let line = 'CREATE';
      if (index.unique) {
        line += ' UNIQUE';
      }
      const indexName = index.name ? `[${index.name}]` : `${shouldPrintSchema(schema, model)
        ? `[${schema.name}].` : ''}[${table.name}_index_${i}]`;
      line += ` INDEX ${indexName} ON ${shouldPrintSchema(schema, model)
        ? `[${schema.name}].` : ''}[${table.name}]`;

      const columnArr = [];
      index.columnIds.forEach((columnId) => {
        const column = model.indexColumns[columnId];
        let columnStr = '';
        if (column.type === 'expression') {
          columnStr = `(${column.value})`;
        } else {
          columnStr = `"${column.value}"`;
        }
        columnArr.push(columnStr);
      });
      line += ` (${columnArr.join(', ')})`;
      line += '\nGO\n';

      return line;
    });

    return indexArr;
  }

  static exportComments (comments, model) {
    const commentArr = comments.map((comment) => {
      const table = model.tables[comment.tableId];
      const schema = model.schemas[table.schemaId];
      let line = '';
      line = 'EXEC sp_addextendedproperty\n';

      switch (comment.type) {
        case 'table': {
          line += `@name = N\'Table_Description\',\n`;
          line += `@value = '${table.note.replace(/'/g, "\"")}',\n`;
          line += `@level0type = N'Schema', @level0name = '${shouldPrintSchema(schema, model) ? `${schema.name}` : 'dbo'}',\n`;
          line += `@level1type = N'Table',  @level1name = '${table.name}';\n`;
          break;
        }
        case 'column': {
          const field = model.fields[comment.fieldId];
          line += `@name = N\'Column_Description\',\n`;
          line += `@value = '${field.note.replace(/'/g, "\"")}',\n`;
          line += `@level0type = N'Schema', @level0name = '${shouldPrintSchema(schema, model) ? `${schema.name}` : 'dbo'}',\n`;
          line += `@level1type = N'Table',  @level1name = '${table.name}',\n`;
          line += `@level2type = N'Column', @level2name = '${field.name}';\n`;
          break;
        }
        default:
          break;
      }

      line += 'GO\n';

      return line;
    });

    return commentArr;
  }

  static export (model) {
    const database = model.database['1'];

    const statements = database.schemaIds.reduce((prevStatements, schemaId) => {
      const schema = model.schemas[schemaId];
      const { tableIds, refIds } = schema;

      if (shouldPrintSchema(schema, model)) {
        prevStatements.schemas.push(`CREATE SCHEMA [${schema.name}]\nGO\n`);
      }

      if (!_.isEmpty(tableIds)) {
        prevStatements.tables.push(...SqlServerExporter.exportTables(tableIds, model));
      }

      const indexIds = _.flatten(tableIds.map((tableId) => model.tables[tableId].indexIds));
      if (!_.isEmpty(indexIds)) {
        prevStatements.indexes.push(...SqlServerExporter.exportIndexes(indexIds, model));
      }

      const commentNodes = _.flatten(tableIds.map((tableId) => {
        const { fieldIds, note } = model.tables[tableId];
        const fieldObjects = fieldIds
          .filter((fieldId) => model.fields[fieldId].note)
          .map((fieldId) => ({ type: 'column', fieldId, tableId }));
        return note ? [{ type: 'table', tableId }].concat(fieldObjects) : fieldObjects;
      }));
      if (!_.isEmpty(commentNodes)) {
        prevStatements.comments.push(...SqlServerExporter.exportComments(commentNodes, model));
      }

      if (!_.isEmpty(refIds)) {
        prevStatements.refs.push(...SqlServerExporter.exportRefs(refIds, model));
      }

      return prevStatements;
    }, {
      schemas: [],
      enums: [],
      tables: [],
      indexes: [],
      comments: [],
      refs: [],
    });

    const res = _.concat(
      statements.schemas,
      statements.enums,
      statements.tables,
      statements.indexes,
      statements.comments,
      statements.refs,
    ).join('\n');
    return res;
  }
}

export default SqlServerExporter;
