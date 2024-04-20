import { IClickActions } from "../types";
import { ensureElement } from "../utils/utils";
import { Card } from "./Card";

class Preview extends Card {
  protected _button: HTMLButtonElement;

  constructor(container: HTMLElement, actions?: IClickActions) {
    super(container);
    this._button = ensureElement<HTMLButtonElement>('.card__button', container);
    if (actions?.onClick) {
      this._button.addEventListener('click', actions.onClick);
    }
  }
}


export { Preview };