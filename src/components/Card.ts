import { IClickActions, IProduct } from "../types";
import { ensureElement } from "../utils/utils";
import { View } from "./base/View"
import { IEvents } from "./base/events";


class Card extends View<IProduct> {
  protected _title: HTMLHeadingElement;
  protected _category?: HTMLSpanElement | null;
  protected _description?: HTMLParagraphElement | null;
  protected _image?: HTMLImageElement | null;
  protected _price: HTMLSpanElement;

  constructor(container: HTMLElement) {
    super(container);
    this._title = ensureElement<HTMLHeadingElement>('.card__title', container);
    this._price = ensureElement<HTMLSpanElement>('.card__price', container);
    this._category = container.querySelector('.card__category');
    this._description = container.querySelector('card__text');
    this._image = container.querySelector('.card__image');
    this._price = container.querySelector('.card__price');


  }

  protected toggleCategoryClass(value: string) {
    if (!this._category) return;
    const categoryClassObj: Record<string, string> = {
      'софт-скил': 'card__category_soft',
      'другое': 'card__category_other',
      'дополнительное': 'card__category_additional',
      'кнопка': 'card__category_button',
      'хард-скил': 'card__category_hard'
    }
    if (value in categoryClassObj) {
      const classModifier = categoryClassObj[value];
      this.toggleClass(this._category, categoryClassObj[value], true);
    }

  }

  get title() {
    return this._title.textContent || '';
  }

  set title(value: string) {
    this.setText(this._title, value);
  }

  get category() {
    return this._category.textContent || '';
  }

  set category(value: string) {
    this.toggleCategoryClass(value);
    this.setText(this._category, value);
  }

  get price() {
    return this._price.textContent || '';
  }

  set price(value: string) {
    this.setText(this._price, `${value} синапсов`);
  }

  set image(value: string) {
    this.setImage(this._image, value);
  }


}



class CatalogCard extends Card {

  constructor(container: HTMLElement, actions?: IClickActions) {
    super(container);
    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }

}

class BasketCard extends Card {
  protected button: HTMLElement;

  constructor(container: HTMLElement, actions?: IClickActions) {
    super(container);
    this.button = ensureElement<HTMLButtonElement>('.card__button');
    if (actions?.onClick) {
      this.container.addEventListener('click', actions.onClick);
    }
  }
}



export {Card, CatalogCard, BasketCard};
