import { ensureAllElements, ensureElement } from "../../utils/utils";
import { View } from "../base/View";
import { IEvents } from "../base/events";
import { IFormState } from "../../types";


class Form<T> extends View<IFormState> {
  protected container: HTMLFormElement;
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
      this.onInputChange();
    })

    this.container.addEventListener('submit', (evt: Event) => {
      evt.preventDefault();
      this.events.emit(`${this.container.name}:submit`);
    })
  }

  protected onInputChange() {
    const inputDataList = this.inputList.map(inputElement => {
      return {field: inputElement.name, value: inputElement.value}
    });
    this.events.emit(`${this.container.name}:input`, inputDataList);
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
