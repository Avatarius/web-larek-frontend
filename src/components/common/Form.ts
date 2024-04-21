import { ensureAllElements, ensureElement } from "../../utils/utils";
import { View } from "../base/View";
import { IEvents } from "../base/events";

interface IFormState {
  valid: boolean;
  error: string;
}

class Form<T> extends View<IFormState> {
  protected container: HTMLElement;
  protected events: IEvents;
  protected inputList: HTMLInputElement[];
  protected _submit: HTMLButtonElement;
  protected _error: HTMLSpanElement;
  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;
    this.inputList = ensureAllElements<HTMLInputElement>('.form__input', container);
    this._submit = ensureElement<HTMLButtonElement>('button[type=submit]', container);
    this._error = ensureElement<HTMLSpanElement>('.form__errors', container);

    this.container.addEventListener('input', () => {

    })
    this.container.addEventListener('input', (evt: Event) => {
      const target = evt.target as HTMLInputElement;
      const field = target.name as keyof T;
      const value = target.value;
      this.onInputChange(field, value);
    })
  }

  onInputChange(field: keyof T, value: string) {
    this.events.emit('delivery:input', {field, value});
  }

  set valid(value: boolean) {
    this.setDisabled(this._submit, !value);
  }

  set error(value: string) {
    this.setText(this._error, value);
  }

  render(data?: Partial<T> & IFormState): HTMLElement {
    const {valid, error, ...inputs} = data;
    super.render({valid, error});
    Object.assign(this, inputs);
    return this.container;
  }

}


export {Form};
