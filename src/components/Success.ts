import { IClickActions } from '../types';
import { ensureElement } from '../utils/utils';
import { View } from './base/View';

interface ISuccessView {
	total: number;
}

class SuccessView extends View<ISuccessView> {
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, actions: IClickActions) {
		super(container);
		this.button = ensureElement<HTMLButtonElement>('.button', container);
		if (actions?.onClick) {
			this.button.addEventListener('click', actions.onClick);
		}
	}
}

export { SuccessView };
