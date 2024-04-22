import { ensureAllElements, ensureElement } from '../utils/utils';
import { IEvents } from './base/events';
import { Form } from './common/FormView';
import { IContacts, IDelivery } from '../types';

class OrderView extends Form<IDelivery> {
	protected buttonContainer: HTMLDivElement;
	protected onlineButton: HTMLButtonElement;
	protected cashButton: HTMLButtonElement;

	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.buttonContainer = ensureElement<HTMLDivElement>(
			'.order__buttons',
			container
		);
		[this.onlineButton, this.cashButton] = ensureAllElements<HTMLButtonElement>(
			'.button_alt',
			container
		);

		this.buttonContainer.addEventListener('click', (evt) => {
			if (evt.target === this.onlineButton || evt.target === this.cashButton) {
				const button = evt.target as HTMLButtonElement;
				this.toggleClass(this.onlineButton, 'button_alt-active', false);
				this.toggleClass(this.cashButton, 'button_alt-active', false);
				this.toggleClass(button, 'button_alt-active', true);
				this.emitInput();
			}
		});
	}

	protected getActiveButton(): HTMLButtonElement | null {
		if (this.onlineButton.classList.contains('button_alt-active')) {
			return this.onlineButton;
		} else if (this.cashButton.classList.contains('button_alt-active')) {
			return this.cashButton;
		} else {
			return null;
		}
	}

  clear(): void {
    super.clear();
    this.toggleClass(this.onlineButton, 'button_alt-active', false);
    this.toggleClass(this.cashButton, 'button_alt-active', false);
  }

	get payment(): string {
		const buttonActive = this.getActiveButton();
		const result = buttonActive ? buttonActive.name : '';
		return result;
	}

	get address(): string {
		return (this.container.elements.namedItem('address') as HTMLInputElement)
			.value;
	}

	get valid(): boolean {
		const isInputValid = super.valid;
		return isInputValid && this.payment !== '';
	}

	set valid(value: boolean) {
		super.valid = value;
	}
}

class ContactsView extends Form<IContacts> {
	constructor(container: HTMLFormElement, events: IEvents) {
		super(container, events);
	}

	get email(): string {
		return (this.container.elements.namedItem('email') as HTMLInputElement)
			.value;
	}

	get phone(): string {
		return (this.container.elements.namedItem('phone') as HTMLInputElement)
			.value;
	}
}

export { OrderView, ContactsView };
