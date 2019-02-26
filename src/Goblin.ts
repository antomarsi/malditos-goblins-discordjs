import { Ocupacao } from './Ocupacao';

export default class Goblin {
  public ocupacao: Ocupacao;
  public coloracao = null;
  constructor(name?:string) {

  }

  get combate(): Number {
    return 0;
  }
  get conhecimento(): Number {
    return 0;
  }
  get habilidate(): Number {
    return 0;
  }
  get sorte(): Number {
    return 0;
  }
}