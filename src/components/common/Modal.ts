import { ensureElement } from "../../utils/utils";
import { View } from "../base/View";
import { IEvents } from "../base/events";

interface IModal {
  content: HTMLElement;
}

class Modal extends View<IModal> {
  protected events: IEvents;
  protected _closeButton: HTMLButtonElement;
  protected _content: HTMLElement;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;
    this._closeButton = ensureElement<HTMLButtonElement>('.modal__close', container);
    this._content = ensureElement<HTMLDivElement>('.modal__content', container);
    this._closeButton.addEventListener('click', () => this.events.emit('modal:close'));
  }

  open() {
    this.toggleClass(this.container, 'modal_active', true);
  }

  close() {
    this.toggleClass(this.container, 'modal_active', false);
  }

  set content(value: HTMLElement) {
    this._content.replaceChildren(value);
  }
}


export {Modal};
