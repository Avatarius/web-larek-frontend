import './scss/styles.scss';
import { cloneTemplate, ensureElement } from './utils/utils';
import { ShopApi } from './components/ShopApi';
import { CDN_URL, API_URL } from './utils/constants';
import { Catalog } from './components/Catalog';
import { EventEmitter } from './components/base/events';
import { CatalogCard, PreviewCard, BasketCard } from './components/CardView';
import {
	ICatalogCard,
	IContacts,
	IDelivery,
	IForm,
	IFormState,
	IIdentifier,
	IOrderData,
	IOrderList,
	IOrderResult,
	IProduct,
	PaymentMethod,
} from './types';
import { Page } from './components/PageView';
import { Modal } from './components/common/ModalView';
import { Basket } from './components/Basket';
import { BasketView } from './components/BasketView';
import { ContactsView, OrderView } from './components/OrderView';
import { INPUT_ERROR_TEXT } from './utils/constants';
import { SuccessView } from './components/SuccessView';
import { OrderBuilder } from './components/Order';

const pageContent = ensureElement<HTMLElement>('.page');
const modalContainer = ensureElement<HTMLDivElement>('#modal-container');

// темплейты
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

// Классы - модели
const api = new ShopApi(CDN_URL, API_URL);
const emitter = new EventEmitter();
const catalog = new Catalog({}, emitter);
const basket = new Basket({}, emitter);
const orderBuilder = new OrderBuilder({}, emitter);

// Классы - отобаржения
const page = new Page(pageContent, emitter);
const modal = new Modal(modalContainer, emitter);
const previewUI = new PreviewCard(cloneTemplate(cardPreviewTemplate), emitter);
const basketUI = new BasketView(cloneTemplate(basketTemplate), emitter);
const orderUI = new OrderView(cloneTemplate(orderTemplate), emitter);
const contactsUI = new ContactsView(cloneTemplate(contactsTemplate), emitter);
const successUI = new SuccessView(cloneTemplate(successTemplate), emitter);

function validate(form: IForm) {
	const errorText = !form.valid ? INPUT_ERROR_TEXT : '';
	const validity: IFormState = { valid: form.valid, error: errorText };
	form.render(validity);
}

emitter.on('catalog:items-changed', (data: IProduct[]) => {
	const cardList = data.map((item) => {
		const card = new CatalogCard<ICatalogCard>(
			cloneTemplate(cardTemplate),
			emitter
		);
		return card.render(item);
	});
	page.render({ catalog: cardList });
});

emitter.on('card:select', (data: IIdentifier) => {
	modal.open();
	const product = catalog.find(data.id);
	if (product) {
		const previewData = Object.assign(product, {
			valid: Boolean(product.price),
			state: !basket.contains(data.id),
		});
		modal.render({ content: previewUI.render(previewData) });
	}
});

emitter.on('basket:open', () => {
	modal.open();
	modal.render({
		content: basketUI.render({
			price: basket.total,
			valid: basket.length === 0,
		}),
	});
});

emitter.on('basket:add', (data: IIdentifier) => {
	const product = catalog.find(data.id);
	basket.add(product);
});

emitter.on('basket:remove', (data: IIdentifier) => {
	basket.remove(data.id);
});

emitter.on('basket:items-changed', (data: IIdentifier) => {
	previewUI.render({ valid: true, state: !basket.contains(data.id) });
	page.render({ counter: basket.length });
	const cardList = basket.items.map((item, index) => {
		const cardData = Object.assign(item, { index: index + 1 });
		const card = new BasketCard(cloneTemplate(cardBasketTemplate), emitter);
		return card.render(cardData);
	});
	basketUI.render({
		list: cardList,
		valid: basket.length === 0,
		price: basket.total,
	});
});

emitter.on('order:open', () => {
	const orderList: IOrderList = {
		total: basket.total,
		items: basket.getIdList(),
	};
	orderBuilder.orderList = orderList;
	modal.render({
		content: orderUI.render({ valid: orderUI.valid, error: '' }),
	});
});

emitter.on('order:input', () => {
	validate(orderUI);
});

emitter.on('order:submit', () => {
	const deliveryData: IDelivery = {
		payment: orderUI.payment as PaymentMethod,
		address: orderUI.address,
	};
	orderBuilder.delivery = deliveryData;
	modal.render({
		content: contactsUI.render({ valid: contactsUI.valid, error: '' }),
	});
});

emitter.on('contacts:input', () => {
	validate(contactsUI);
});

emitter.on('contacts:submit', () => {
	const contactsData: IContacts = {
		email: contactsUI.email,
		phone: contactsUI.phone,
	};
	orderBuilder.contacts = contactsData;
	const apiObj: IOrderData = orderBuilder.result.toApiObject();
	api
		.postOrder(apiObj)
		.then((data: IOrderResult) => {
			modal.render({ content: successUI.render({ total: data.total }) });
			orderUI.clear();
			contactsUI.clear();
			basket.clear();
		})
		.catch((error) => {
			console.log(`Ошибка ${error}`);
		});
});

emitter.on('success:submit', () => {
	modal.close();
});

// получить данные с сервера
api
	.getProductList()
	.then((data) => {
		catalog.items = data;
	})
	.catch((error) => {
		console.log(`Ошибка ${error}`);
	});
