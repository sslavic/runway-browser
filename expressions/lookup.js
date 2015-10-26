"use strict";

let errors = require('../errors.js');
let Expression = require('./expression.js');
let RecordType = require('../types/record.js');

class Lookup extends Expression {
  constructor(parsed, env) {
    super(parsed, env);
    let makeExpression = require('./factory.js');
    this.parent = makeExpression(this.parsed.parent, this.env);
  }

  typecheck() {
    this.parent.typecheck();
    if (!(this.parent.type instanceof RecordType)) {
      throw new errors.Type(`Cannot lookup field in a ${this.parent.type} (defined at ${this.parent.parsed.source})`);
    }
    this.type = this.parent.type.fieldType(this.parsed.child.value);
    if (this.type === undefined) {
      throw new errors.Type(`${this.parent.type} has no field ${this.parsed.child.value}`);
    }
  }

  evaluate() {
    return this.parent.evaluate().lookup(this.parsed.child.value);
  }

  toString(indent) {
    return `${this.parent.toString(indent)}.${this.parsed.child.value}`;
  }
}

module.exports = Lookup;
