import SymbolFactory from '../../symbol/factory';
import { BindingRequest, createNonIgnorableBindingRequest } from '../../types';
import { destructureMemberAccessExpression, extractVariableFromExpression } from '../../utils';
import { createSchemaSymbolIndex, createTableSymbolIndex } from '../../symbol/symbolIndex';
import { CompileError, CompileErrorCode } from '../../../errors';
import { ElementDeclarationNode, SyntaxNode } from '../../../parser/nodes';
import { ContextStack, ValidatorContext } from '../validatorContext';
import ElementValidator from './elementValidator';
import { ElementKind, createContextValidatorConfig, createSubFieldValidatorConfig } from '../types';
import {
  complexBodyConfig,
  noAliasConfig,
  noSettingListConfig,
  noUniqueConfig,
  registerNameConfig,
} from './_preset_configs';
import { SchemaSymbol } from '../../symbol/symbols';
import { isValidName } from '../utils';
import { transformToReturnCompileErrors } from './utils';

export default class TableGroupValidator extends ElementValidator {
  protected elementKind: ElementKind = ElementKind.TABLEGROUP;

  protected context = createContextValidatorConfig({
    name: ValidatorContext.TableGroupContext,
    errorCode: CompileErrorCode.INVALID_TABLEGROUP_CONTEXT,
    stopOnError: false,
  });

  protected unique = noUniqueConfig.doNotStopOnError();

  protected name = registerNameConfig.doNotStopOnError();

  protected alias = noAliasConfig.doNotStopOnError();

  protected settingList = noSettingListConfig.doNotStopOnError();

  protected body = complexBodyConfig.doNotStopOnError();

  protected subfield = createSubFieldValidatorConfig({
    argValidators: [
      {
        validateArg: transformToReturnCompileErrors(
          isValidName,
          CompileErrorCode.INVALID_TABLEGROUP_ELEMENT_NAME,
          'This field must be a valid table name',
        ),
        registerBindingRequest: registerTableName,
      },
    ],
    invalidArgNumberErrorCode: CompileErrorCode.INVALID_TABLEGROUP_FIELD,
    invalidArgNumberErrorMessage: 'A TableGroup field must be a single valid table name',
    settingList: noSettingListConfig.doNotStopOnError(),
    shouldRegister: false,
    duplicateErrorCode: undefined,
  });

  constructor(
    declarationNode: ElementDeclarationNode,
    publicSchemaSymbol: SchemaSymbol,
    contextStack: ContextStack,
    bindingRequests: BindingRequest[],
    errors: CompileError[],
    kindsGloballyFound: Set<ElementKind>,
    kindsLocallyFound: Set<ElementKind>,
    symbolFactory: SymbolFactory,
  ) {
    super(
      declarationNode,
      publicSchemaSymbol,
      contextStack,
      bindingRequests,
      errors,
      kindsGloballyFound,
      kindsLocallyFound,
      symbolFactory,
    );
  }
}

function registerTableName(
  node: SyntaxNode,
  ownerElement: ElementDeclarationNode,
  bindingRequests: BindingRequest[],
) {
  if (!isValidName(node)) {
    throw new Error('Unreachable - Must be a valid name when registerTableName is called');
  }
  const fragments = destructureMemberAccessExpression(node).unwrap();
  const table = fragments.pop()!;
  const tableId = createTableSymbolIndex(extractVariableFromExpression(table).unwrap());
  const schemaStack = fragments.map((s) => ({
    index: createSchemaSymbolIndex(extractVariableFromExpression(s).unwrap()),
    referrer: s,
  }));
  bindingRequests.push(
    createNonIgnorableBindingRequest({
      subnames: [...schemaStack, { index: tableId, referrer: table }],
      ownerElement,
    }),
  );
}
