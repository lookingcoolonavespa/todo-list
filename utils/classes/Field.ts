import { HTMLInputTypeAttribute } from 'react';

export default class Field<N extends string> {
  label: string;
  name: N;
  type: HTMLInputTypeAttribute;

  constructor(label: string, name: N, type: HTMLInputTypeAttribute) {
    (this.label = label), (this.name = name);
    this.type = type;
  }
}
