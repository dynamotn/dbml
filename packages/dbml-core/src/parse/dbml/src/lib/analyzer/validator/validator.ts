import Report from '../../report';
import { CompileError } from '../../errors';
import { ProgramNode } from '../../parser/nodes';
import { ContextStack } from './validatorContext';
import { SchemaSymbol } from '../symbol/symbols';
import SymbolFactory from '../symbol/factory';
import { pickValidator } from './utils';
import { ElementKind } from './types';
import SymbolTable from '../symbol/symbolTable';
import { BindingRequest } from '../types';

export default class Validator {
  private ast: ProgramNode;

  private publicSchemaSymbol: SchemaSymbol;

  private contextStack: ContextStack;

  private kindsGloballyFound: Set<ElementKind>;
  private kindsLocallyFound: Set<ElementKind>;

  private bindingRequests: BindingRequest[];

  private errors: CompileError[];

  private symbolFactory: SymbolFactory;

  constructor(ast: ProgramNode, symbolFactory: SymbolFactory) {
    this.ast = ast;
    this.contextStack = new ContextStack();
    this.errors = [];
    this.symbolFactory = symbolFactory;
    this.publicSchemaSymbol = this.symbolFactory.create(SchemaSymbol, {
      symbolTable: new SymbolTable(),
    });
    this.kindsGloballyFound = new Set();
    this.kindsLocallyFound = new Set();
    this.bindingRequests = [];

    this.ast.symbol = this.publicSchemaSymbol;
    this.ast.symbol.declaration = this.ast;
  }

  validate(): Report<{ program: ProgramNode; bindingRequests: BindingRequest[] }, CompileError> {
    this.ast.body.forEach((element) => {
      // eslint-disable-next-line no-param-reassign
      element.parentElement = this.ast;
      const Val = pickValidator(element);
      const validatorObject = new Val(
        element,
        this.publicSchemaSymbol,
        this.contextStack,
        this.bindingRequests,
        this.errors,
        this.kindsGloballyFound,
        this.kindsLocallyFound,
        this.symbolFactory,
      );
      validatorObject.validate();
    });

    return new Report(
      { program: this.ast, schema: this.publicSchemaSymbol, bindingRequests: this.bindingRequests },
      this.errors,
    );
  }
}
