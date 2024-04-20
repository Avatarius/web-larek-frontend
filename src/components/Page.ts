import { ensureElement } from "../utils/utils";
import { View } from "./base/View";
import { IEvents } from "./base/events";

interface IPage  {
  catalog: HTMLElement;
}


class Page extends View<IPage> {
  protected _basketButton: HTMLElement;
  protected _catalog: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._basketButton = ensureElement<HTMLElement>('.header__basket');
    this._catalog = ensureElement<HTMLElement>('.gallery');

    this._basketButton.addEventListener('click', () => events.emit('basket:open'));

  }

  set catalog(items: HTMLElement[]) {
    this._catalog.replaceChildren(...items);
  }
}


export {Page};
