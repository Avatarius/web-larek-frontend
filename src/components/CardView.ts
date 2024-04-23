import { View } from './base/View';
import { ensureElement } from '../utils/utils';
import { IPreviewCard, IBasketCard } from '../types';
import {
	BUY_BUTTON_TEXT,
	REMOVE_BUTTON_TEXT,
	UNABLE_BUTTON_TEXT,
} from '../utils/constants';
import { IEvents } from './base/Events';

class Card<T> extends View<T> {
	protected _title: HTMLHeadingElement;
	protected _price: HTMLSpanElement;
	protected _id: string;
	protected events: IEvents;

	constructor(container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;
		this._title = ensureElement<HTMLHeadingElement>('.card__title', container);
		this._price = ensureElement<HTMLSpanElement>('.card__price', container);
	}

	get id() {
		return this._id;
	}

	set id(value: string) {
		this._id = value;
	}

	get title() {
		return this._title.textContent || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get price() {
		return this._price.textContent || '';
	}

	set price(value: string) {
		const priceText = value ? `${value} синапсов` : 'Бесценно';
		this.setText(this._price, priceText);
	}
}

class CatalogCard<T> extends Card<T> {
	protected _category: HTMLSpanElement;
	protected _image: HTMLImageElement;
	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this._category = ensureElement<HTMLSpanElement>(
			'.card__category',
			container
		);
		this._image = ensureElement<HTMLImageElement>('.card__image', container);
		this.container.addEventListener('click', () =>
			this.events.emit('card:select', { id: this.id })
		);
	}

	protected toggleCategoryClass(value: string) {
		const categoryClassObj: Record<string, string> = {
			'софт-скил': 'card__category_soft',
			'другое': 'card__category_other',
			'дополнительное': 'card__category_additional',
			'кнопка': 'card__category_button',
			'хард-скил': 'card__category_hard',
		};
		if (value in categoryClassObj) {
			const classModifier = categoryClassObj[value];
			this.toggleClass(this._category, classModifier, true);
		}
	}

	get category() {
		return this._category.textContent || '';
	}

	set category(value: string) {
		this.toggleCategoryClass(value);
		this.setText(this._category, value);
	}

	set image(value: string) {
		this.setImage(this._image, value);
	}
}

class PreviewCard extends CatalogCard<IPreviewCard> {
	protected _description: HTMLParagraphElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this._description = ensureElement<HTMLParagraphElement>(
			'.card__text',
			container
		);
		this.button = ensureElement<HTMLButtonElement>('.card__button', container);

		this.button.addEventListener('click', () => {
			if (this.button.textContent === BUY_BUTTON_TEXT) {
				this.events.emit('basket:add', { id: this.id });
			} else {
				this.events.emit('basket:remove', { id: this.id });
			}
		});
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	get valid() {
		return !this.button.disabled;
	}

	set valid(state: boolean) {
		this.setDisabled(this.button, !state);
	}

	set state(state: boolean) {
		if (!this.valid) {
			this.setText(this.button, UNABLE_BUTTON_TEXT);
		} else {
			const text = state ? BUY_BUTTON_TEXT : REMOVE_BUTTON_TEXT;
			this.setText(this.button, text);
		}
	}
}

class BasketCard extends Card<IBasketCard> {
	protected _index: HTMLSpanElement;
	protected button: HTMLButtonElement;

	constructor(container: HTMLElement, events: IEvents) {
		super(container, events);
		this._index = ensureElement<HTMLSpanElement>(
			'.basket__item-index',
			container
		);
		this.button = ensureElement<HTMLButtonElement>('.card__button', container);

		this.button.addEventListener('click', () =>
			this.events.emit('basket:remove', { id: this.id })
		);
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
}

export { CatalogCard, PreviewCard, BasketCard };
