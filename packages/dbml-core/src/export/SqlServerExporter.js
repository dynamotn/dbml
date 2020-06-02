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

    return tableStrs.length ? tableStrs.join('\n') : '';
  }

  static exportRefs (refIds, model) {
    const strArr = refIds.map((refId) => {
      const ref = model.refs[refId];
      const refEndpointIndex = ref.endpointIds.findIndex(endpointId => model.endpoints[endpointId].relation === '1');
      const foreignEndpointId = ref.endpointIds[1 - refEndpointIndex];
      const refEndpointId = ref.endpointIds[refEndpointIndex];
      const foreignEndpoint = model.endpoints[foreignEndpointId];
      const refEndpoint = model.endpoints[refEndpointId];

      const refEndpointField = model.fields[refEndpoint.fieldId];
      const refEndpointTable = model.tables[refEndpointField.tableId];
      const refEndpointSchema = model.schemas[refEndpointTable.schemaId];

      const foreignEndpointField = model.fields[foreignEndpoint.fieldId];
      const foreignEndpointTable = model.tables[foreignEndpointField.tableId];
      const foreignEndpointSchema = model.schemas[foreignEndpointTable.schemaId];

      let line = `ALTER TABLE ${shouldPrintSchema(foreignEndpointSchema, model)
        ? `[${foreignEndpointSchema.name}].` : ''}[${foreignEndpointTable.name}] ADD `;

      if (ref.name) {
        line += `CONSTRAINT [${ref.name}] `;
      }

      line += `FOREIGN KEY ([${foreignEndpointField.name}]) REFERENCES ${shouldPrintSchema(refEndpointSchema, model)
        ? `[${refEndpointSchema.name}].` : ''}[${refEndpointTable.name}] ([${refEndpointField.name}])`;
      if (ref.onDelete) {
        line += ` ON DELETE ${ref.onDelete.toUpperCase()}`;
      }
      if (ref.onUpdate) {
        line += ` ON UPDATE ${ref.onUpdate.toUpperCase()}`;
      }
      line += '\nGO\n';

      return line;
    });

    return strArr.length ? strArr.join('\n') : '';
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

    return indexArr.length ? indexArr.join('\n') : '';
  }

  static exportComments (comments, model) {
    const commentArr = comments.map((comment) => {
      let line = '';
      const commentType = {'column': 'Column',
                          'table': 'Table',
                          'project': 'Project'};

      // if (comment.type === 'column') {
      // if (comment.type in commentType) {
      switch (comment.type) { 
        case 'project': {
          // const field = model.fields[comment.fieldId];
          // const table = model.tables[comment.tableId];
          const schema = model.schemas[comment.schemaId];
          line = 'EXEC sp_addextendedproperty\n';
          line += `@name = N\'${commentType[comment.type]}_Description\'\n`;
          line += `@value = '${schema.note}'\n`; 
          line += `@level0type = N'Schema', @level0name = '${shouldPrintSchema(schema, model) ? `${schema.name}` : 'dbo'}',\n`;
          // line += `@level1type = N'Table',  @level1name = '${table.name}',\n`; 
          // line += `@level2type = N'Column', @level2name = '${field.name}';\n`;
          break; 
        }
        case 'table': {
          // const field = model.fields[comment.fieldId];
          const table = model.tables[comment.tableId];
          const schema = model.schemas[table.schemaId];
          line = 'EXEC sp_addextendedproperty\n';
          line += `@name = N\'${commentType[comment.type]}_Description\'\n`;
          line += `@value = '${table.note}'\n`; 
          line += `@level0type = N'Schema', @level0name = '${shouldPrintSchema(schema, model) ? `${schema.name}` : 'dbo'}',\n`;
          line += `@level1type = N'Table',  @level1name = '${table.name}',\n`; 
          // line += `@level2type = N'Column', @level2name = '${field.name}';\n`;
          break; 
        }
        case 'column': {
          const field = model.fields[comment.fieldId];
          const table = model.tables[field.tableId];
          const schema = model.schemas[table.schemaId];
          line = 'EXEC sp_addextendedproperty\n';
          line += `@name = N\'${commentType[comment.type]}_Description\'\n`;
          line += `@value = '${field.note}'\n`; 
          line += `@level0type = N'Schema', @level0name = '${shouldPrintSchema(schema, model) ? `${schema.name}` : 'dbo'}',\n`;
          line += `@level1type = N'Table',  @level1name = '${table.name}',\n`; 
          line += `@level2type = N'Column', @level2name = '${field.name}';\n`;
          break;
        }
      }

      line += 'GO\n';

      return line;
    });

    return commentArr.length ? commentArr.join('\n') : '';
  }

  static export (model) {
    let res = '';
    let hasBlockAbove = false;
    const database = model.database['1'];
    const indexIds = [];
    const comments = [];

    database.schemaIds.forEach((schemaId) => {
      const schema = model.schemas[schemaId];
      const { tableIds, refIds } = schema;
      const { note } = schema; 
      if (note) {
        comments.push({type: 'project', schemaId});
      }
      // console.log(schema, "schema");
      // console.log(tableIds, "tableIds"); 

      if (shouldPrintSchema(schema, model)) {
        if (hasBlockAbove) res += '\n';
        res += `CREATE SCHEMA [${schema.name}];\nGO\n`;
        hasBlockAbove = true;
      }

      if (!_.isEmpty(tableIds)) {
        if (hasBlockAbove) res += '\n';
        res += SqlServerExporter.exportTables(tableIds, model);
        hasBlockAbove = true;
      }

      if (!_.isEmpty(refIds)) {
        if (hasBlockAbove) res += '\n';
        res += SqlServerExporter.exportRefs(refIds, model);
        hasBlockAbove = true;
      }

      /////////PUSH COMMENTS TO COLUMN/////////
      // console.log(JSON.stringify(tableIds, null, 2));
      indexIds.push(...(_.flatten(tableIds.map((tableId) => model.tables[tableId].indexIds))));
      comments.push(...(_.flatten(tableIds.map((tableId) => {
        const { fieldIds } = model.tables[tableId];
        const {note} = model.tables[tableId]; 
        if (note) {
          return [{type: 'table', tableId}, fieldIds
          .filter((fieldId) => model.fields[fieldId].note)
          .map((fieldId) => ({ type: 'column', fieldId }))];
        }
        // console.log(fieldIds
        //   .filter((fieldId) => model.fields[fieldId].note)
        //   .map((fieldId) => ({ type: 'column', fieldId })));
        return fieldIds
          .filter((fieldId) => model.fields[fieldId].note)
          .map((fieldId) => ({ type: 'column', fieldId }));
      }))));
    console.log(comments, "commentsssss");
    });

    if (!_.isEmpty(indexIds)) {
      if (hasBlockAbove) res += '\n';
      res += SqlServerExporter.exportIndexes(indexIds, model);
      hasBlockAbove = true;
    }

    if (!_.isEmpty(comments)) {
      if (hasBlockAbove) res += '\n';
      res += SqlServerExporter.exportComments(comments, model);
      hasBlockAbove = true;
    }

    return res;
  }
}

export default SqlServerExporter;
