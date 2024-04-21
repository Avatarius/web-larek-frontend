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
import { IBasketItem, IFormInput, IProduct } from './types';
import { BasketView } from './components/BasketView';
import { DeliveryView } from './components/DeliveryView';

// темплейты
const cardTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');

const api = new ShopApi(CDN_URL, API_URL);
const emitter = new EventEmitter();
const content = ensureElement<HTMLElement>('.page');
const page = new Page(content, emitter);
const modal = new Modal(ensureElement<HTMLDivElement>('#modal-container'), emitter);
const basket = new Basket({}, emitter);
const basketUI = new BasketView(cloneTemplate(basketTemplate), {onClick: () => emitter.emit('delivery:open')});
const delivery = new DeliveryView(cloneTemplate(deliveryTemplate), emitter);

emitter.on('basket:open', () => {
  modal.open();
  modal.content = basketUI.render();
})

emitter.on('delivery:open', () => {

  modal.content = delivery.render({valid: false, error: INPUT_ERROR_TEXT});
})

emitter.on('delivery:input', (data: IFormInput) => {
  const isValid = (data.value.length > 0) && delivery.isPaymentSelected();
  delivery.valid = isValid;
  const errorText = !isValid ? INPUT_ERROR_TEXT : '';
  delivery.error = errorText;
})

emitter.on('contacts:open', () => {

})

emitter.on('basket:items-changed', () => {
  const cardList = basket.items.map((item, index) => {
    const data: IBasketItem = Object.assign(item, {index: index + 1})
    const card = new BasketCard(cloneTemplate(cardBasketTemplate), {onClick: () => basket.remove(item.id)});
    return card.render(data);
  });
  page.counter = basket.length.toString();
  basketUI.list = cardList;


})


emitter.on('card:click', (data: IProduct) => {
  const previewUI = new Preview(cloneTemplate(cardPreviewTemplate), {onClick: () => {
    if (basket.contains(data.id)) {
      basket.add(data);
      previewUI.setButtonState(false);
    } else {
      basket.remove(data.id);
      previewUI.setButtonState(true);
    }
  }});
  previewUI.setButtonState(basket.contains(data.id));
  modal.content = previewUI.render(data);
  modal.open();

})


emitter.on('modal:close', () => {
  modal.close();
})

api.getProductList()
.then((data) => {
  const cardList = data.map((item) => {
    const card = new CatalogCard(cloneTemplate(cardTemplate), {onClick: () => emitter.emit('card:click', item)});
    return card.render(item);
  })
  page.catalog = cardList;

})
