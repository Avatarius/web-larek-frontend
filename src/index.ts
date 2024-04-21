import './scss/styles.scss';
import { ShopApi } from './components/ShopApi';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { Basket } from './components/Basket';
import { EventEmitter } from './components/base/events';
import { CDN_URL, API_URL, INPUT_ERROR_TEXT } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CatalogCard, BasketCard } from './components/Card';
import { Preview } from './components/Preview';
import { IBasketItem, IInputData, IProduct, IForm, IDeliveryForm, IFormState, IView } from './types';
import { BasketView } from './components/BasketView';
import { OrderView } from './components/OrderView';
import { Form } from './components/common/Form';

// темплейты
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const api = new ShopApi(CDN_URL, API_URL);
const emitter = new EventEmitter();
const content = ensureElement<HTMLElement>('.page');
const page = new Page(content, emitter);
const modal = new Modal(
	ensureElement<HTMLDivElement>('#modal-container'),
	emitter
);
const basket = new Basket({}, emitter);
const basketUI = new BasketView(cloneTemplate(basketTemplate), {
	onClick: () => emitter.emit('order:open'),
});
const order = new OrderView(cloneTemplate(orderTemplate), emitter);
const contacts = new Form(cloneTemplate(contactsTemplate), emitter);

emitter.on('basket:open', () => {
	modal.open();
  modal.render({content: basketUI.render({valid: basket.length === 0})});
});

emitter.on('order:open', () => {
  const errorText = !order.valid ? INPUT_ERROR_TEXT : '';
  modal.render({content: order.render({valid: order.valid, error: errorText})});
});

function validate<T>(form: IForm<T>) {
  const errorText = !form.valid ? INPUT_ERROR_TEXT : '';
  const validity: IFormState = {valid: form.valid, error: errorText};
  form.render(validity);
}

emitter.on('order:input', () => {
  validate(order);
});

emitter.on('order:submit', () => {
  const errorText = !contacts.valid ? INPUT_ERROR_TEXT : '';
  modal.render({content: contacts.render({valid: contacts.valid, error: errorText})});
});

emitter.on('contacts:input', () => {
  validate(contacts);
});

emitter.on('contacts:submit', () => {
  console.log('submit');

})



emitter.on('basket:items-changed', () => {
	const cardList = basket.items.map((item, index) => {
		const data: IBasketItem = Object.assign(item, { index: index + 1 });
		const card = new BasketCard(cloneTemplate(cardBasketTemplate), {
			onClick: () => basket.remove(item.id),
		});
		return card.render(data);
	});
	page.counter = basket.length.toString();
	basketUI.valid = cardList.length === 0;
	basketUI.list = cardList;
});

emitter.on('card:click', (data: IProduct) => {
	const previewUI = new Preview(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			if (basket.contains(data.id)) {
				basket.add(data);
				previewUI.setButtonState(false);
			} else {
				basket.remove(data.id);
				previewUI.setButtonState(true);
			}
		},
	});
	previewUI.setButtonState(basket.contains(data.id));
  modal.render({content: previewUI.render(data)})
	modal.open();
});

emitter.on('modal:close', () => {
	modal.close();
});

api.getProductList().then((data) => {
	const cardList = data.map((item) => {
		const card = new CatalogCard(cloneTemplate(cardTemplate), {
			onClick: () => emitter.emit('card:click', item),
		});
		return card.render(item);
	});
	page.catalog = cardList;
});
