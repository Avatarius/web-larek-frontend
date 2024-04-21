import { ensureAllElements, ensureElement } from "../utils/utils";
import { IEvents } from "./base/events";
import { Form } from "./common/Form"
import { IDelivery } from "../types";

class OrderView extends Form<IDelivery> {
  protected buttonContainer: HTMLDivElement;
  protected onlineButton: HTMLButtonElement;
  protected cashButton: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);
    this.buttonContainer = ensureElement<HTMLDivElement>('.order__buttons', container);
    [this.onlineButton, this.cashButton] = ensureAllElements<HTMLButtonElement>('.button_alt', container);

    this.buttonContainer.addEventListener('click', (evt) => {
      if (evt.target === this.onlineButton || evt.target === this.cashButton) {
        const button = evt.target as HTMLButtonElement;
        this.toggleClass(this.onlineButton, 'button_alt-active', false);
        this.toggleClass(this.cashButton, 'button_alt-active', false);
        this.toggleClass(button, 'button_alt-active', true);
        this.onInputChange();
      }
    });

  }

  isPaymentSelected() {
    return this.onlineButton.classList.contains('button_alt-active') || this.cashButton.classList.contains('button_alt-active');
  }

}


export {OrderView};
