export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;
export const INPUT_ERROR_TEXT = 'Заполните все поля';
export const BUY_BUTTON_TEXT = 'Купить';
export const REMOVE_BUTTON_TEXT = 'Удалить из корзины';
export const UNABLE_BUTTON_TEXT = 'Нельзя купить';
export enum EVENTS {
	ModalOpen = 'modal:open',
	ModalClose = 'modal:close',
	CatalogItemsChanged = 'catalog:items-changed',
	CardSelect = 'card:select',
	BasketOpen = 'basket:open',
	BasketAdd = 'basket:add',
	BasketRemove = 'basket:remove',
	BasketItemsChanged = 'basket:items-changed',
	OrderOpen = 'order:open',
	OrderInput = 'order:input',
	OrderSubmit = 'order:submit',
	ContactsInput = 'contacts:input',
	ContactsSubmit = 'contacts:submit',
	SuccessSubmit = 'success:submit',
}

export const settings = {};
