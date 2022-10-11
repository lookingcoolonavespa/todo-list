import { HTMLInputTypeAttribute } from 'react';

export default class Field {
  label: string;
  name: string;
  type: HTMLInputTypeAttribute;

  constructor(label: string, name: string, type: HTMLInputTypeAttribute) {
    (this.label = label), (this.name = name);
    this.type = type;
  }
}
