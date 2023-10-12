import Report from '../../report';
import { CompileError } from '../../errors';
import { ProgramNode } from '../../parser/nodes';
import { ContextStack } from './validatorContext';
import { SchemaSymbol } from '../symbol/symbols';
import { pickValidator } from './utils';
import { ElementKind } from './types';
import SymbolTable from '../symbol/symbolTable';
import { UnresolvedName } from '../types';

export default class Validator {
  private ast: ProgramNode;

  private publicSchemaSymbol: SchemaSymbol;

  private contextStack: ContextStack;

  private kindsGloballyFound: Set<ElementKind>;
  private kindsLocallyFound: Set<ElementKind>;

  private unresolvedNames: UnresolvedName[];

  private errors: CompileError[];

  constructor(ast: ProgramNode) {
    this.ast = ast;
    this.contextStack = new ContextStack();
    this.errors = [];
    this.publicSchemaSymbol = new SchemaSymbol(new SymbolTable());
    this.kindsGloballyFound = new Set();
    this.kindsLocallyFound = new Set();
    this.unresolvedNames = [];

    this.ast.symbol = this.publicSchemaSymbol;
    this.ast.symbol.declaration = this.ast;
  }

  validate(): Report<{ program: ProgramNode; unresolvedNames: UnresolvedName[] }, CompileError> {
    this.ast.body.forEach((element) => {
      // eslint-disable-next-line no-param-reassign
      element.parentElement = this.ast;
      const Val = pickValidator(element);
      const validatorObject = new Val(
        element,
        this.publicSchemaSymbol,
        this.contextStack,
        this.unresolvedNames,
        this.errors,
        this.kindsGloballyFound,
        this.kindsLocallyFound,
      );
      validatorObject.validate();
    });

    return new Report(
      { program: this.ast, schema: this.publicSchemaSymbol, unresolvedNames: this.unresolvedNames },
      this.errors,
    );
  }
}
