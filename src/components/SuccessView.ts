import { ensureElement } from '../utils/utils';
import { View } from './base/View';
import { IEvents } from './base/Events';

interface ISuccessView {
	total: number;
}

class SuccessView extends View<ISuccessView> {
	protected button: HTMLButtonElement;
	protected events: IEvents;
	protected description: HTMLParagraphElement;
	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.button = ensureElement<HTMLButtonElement>('.button', container);
		this.description = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			container
		);
		this.events = events;
		this.button.addEventListener('click', () =>
			this.events.emit('success:submit')
		);
	}

	set total(value: number) {
		const text = `Списано ${value} синапсов`;
		this.setText(this.description, text);
	}
}

export { SuccessView };
