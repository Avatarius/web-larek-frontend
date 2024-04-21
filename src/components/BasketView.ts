import { ensureElement } from "../utils/utils";
import { View } from "./base/View";
import { IClickActions } from "../types";

interface IBasketView {
  list: HTMLElement[];
  valid: boolean;
  price: number;
}

class BasketView extends View<IBasketView> {
  protected _list: HTMLElement;
  protected _price: HTMLSpanElement;
  protected button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IClickActions) {
    super(container);
    this._list = ensureElement<HTMLUListElement>('.basket__list', container);
    this.button = ensureElement<HTMLButtonElement>('.basket__button', container);
    this._price = ensureElement<HTMLSpanElement>('.basket__price', container);
    if (actions?.onClick) {
      this.button.addEventListener('click', actions.onClick);
    }
  }

  set list(items: HTMLElement[]) {
    this._list.replaceChildren(...items);
  }

  set valid(state: boolean) {
    this.setDisabled(this.button, state);
  }

  set price(value: number) {
    const priceText = value ? `${value} синапсов` : 'Бесценно';
    this.setText(this._price, priceText);
  }

}


export {BasketView};
