# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```


## Документация классов

### Базовый код:
1. Api.
Базовый класс для осуществления низкоуровневых операций с api.\
Конструктор принимает такие аргументы:
`baseUrl: string` - базовый url на api.
`options: RequestInit` - объект с настройками для формирования запроса.
Содержит следующие поля:
`baseUrl: string` - базовый url на api.
`options: RequestInit` - объект с настройками для формирования запроса.
Имеет методы:
`get(uri: string)` - отправить get запрос на сервер.
`post(uri: string, data: object, method: ApiPostMethods = 'POST')` - отправить post запрос на сервер с данными data.
`handleResponse(response: Response): Promise<object>` - обработка ответа с сервера. Если ответ с сервера в порядке, то возвращается json, в ином случае ошибка.
3. EventEmitter.
Брокер событий, реализует паттерн "Наблюдатель", позволяет подписываться на события и уведомлять подписчиков о наступлении события, поддерживает интерфейс IEvents.
Конструктор не принимает аргументов.
Содержит следующие поля:
`_events: Map<EventName, Set<Subscriber>>` - хранит события в виде Map, где ключём является строка или регулярное выражение, а значением сет коллбэков.
Имеет методы:
`on<T extends object>(eventName: EventName, callback: (event: T) => void)` - для подписки на событие.
`off(eventName: EventName, callback: Subscriber)` - для отписки от события.
`emit<T extends object>(eventName: string, data?: T)` - для уведомления подписчиков о наступлении события.
`onAll(callback: (event: EmitterEvent) => void)` - для подписки на все события.
`offAll()` - для сброса всех подписчиков.
`trigger<T extends object>(eventName: string, context?: Partial<T>)` - делает коллбек триггер, генерирующий событие при вызове.
4. Model.
Базовый абстрактный класс для всех классов - моделей для хранения и обработки данных, использует EventEmitter посредством ассоциации.
Конструктор принимает такие аргументы:
`data: Partial<T>` - объект с входными данными. Partial делает поля типа T опциональными.
`events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.
Содержит следующие поля:
`events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.
Имеет методы:
`emitChanges(event: string, payload?: object)` - уведомляет подписчиков об изменениях модели и передаёт данные payload, для этого используется EventEmitter.
5. View.
Базовый абстрактный класс для всех классов - отображений , для отображения данных в UI элементах.
Конструктор принимает такие аргументы:
`container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
Содержит следующие поля:
`container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
Имеет методы:
`toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключение класса className на переданном html элементе(element).
`setText(element: HTMLElement, value: unknown)` - установка текста(value) в выбранный HTMLElement (element).
`setDisabled(element: HTMLElement, state: boolean)` - блокирует переданный html элемент(element), если state === true. В ином случае снимает блокировку.
`setHidden(element: HTMLElement)` - скрывает переданный html элемент(element).
`setVisible(element: HTMLElement)` - отображает переданный html элемент(element).
`setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает url(аргумент src) в поле src переданного html элемента(element) и альтернативный текст(аргумент alt) в поле alt.
`render(data?: Partial<T>): HTMLElement` - отрисовывает компонент на странице и возвращает корневой html элемент. Рендер осуществляется за счёт присваивания переданных данных текущему экземпляру класса. Классы, которые наследуются от View должны иметь набор сеттеров для корректной обработки такого присваивания.
### Компоненты модели данных:
1. ShopApi.
Наследуется от базового класса Api. Осуществляет работу api конкретно данного магазина, позволяет получить список товаров, конкретный товар или оформить заказ сервиса "Web ларёк"
Конструктор принимает такие аргументы:
`cdn: string` - url на изображения товаров.
`baseUrl: string` - базовый url на api.
`options?: RequestInit` - объект с настройками для формирования запроса.
Содержит следующие поля:
`cdn: string` - url на изображения товаров.
Имеет методы:
`getProductList(): IProductItem[]` - получает с сервера список товаров для дальнейшей передачи их в Catalog и отрисовки посредством CardView и CatalogView.
`getProductItem(id: string)` - получает с сервера конкретный товар по id. Эти данные нужны для формирования заказа.
`postOrder(order: IOrder): IOrderResult` - отправляет post запрос на сервер, содержащий данные о заказе. Для этого нужны данные о заказе (способ оплаты, адрес, email, телефон)
и информация о купленных товарах(их id, общая стоимость).
2. Product.
Наследуется от базового класса Model. Представляет собой класс - адаптер и соответственно реализует паттерн "адаптер". Используется для хранения и обработки данных об 1 еденице товара.
Конструктор принимает такие аргументы:
`product: IProductItem` - объект, полученный из api, поддерживает интерфейс IProductItem.
Содержит следующие поля:
`product: IProductItem` - объект, полученный из api, поддерживает интерфейс IProductItem.
Имеет ряд методов для конвертации объекта в формат, удобный для классов - отображений,
такие как:
`toProductCardUIObj(): IProductCardUI`  - конвертация в объект, удобный для класса - отображения CardView, поддерживает интерфейс IProductCardUI.
`toProductItemUIObj(): IProductItemUI` - конвертация в объект, удобный для класса - отображения ProductView, поддерживает интерфейс IProductItemUI.
`toBasketItemUIObj(): IBasketItemUI` - конвертация в объект, удобный для класса - отображения BasketItemView, поддерживает интерфейс IBasketItemUI.
3. Catalog.
Наследуется от базового класса Model. Представляет собой модель для коллекции товаров на главной странице, используется для хранения и обработки данных о коллекции товаров.
Хранит список объектов, которые поддерживают интерфейс IProductItem(чтобы иметь доступ к методам конвертации).
При добавлении объектов генерируется событие 'catalog:items-changed', по которому cardView и catalogView отрисовывает список карточек.
Конструктор не принимает аргументов.
Содержит следующие поля:
`_items: IProductItem[]` - массив объектов - товаров.
Имеет методы:
`set items(productList: IProduct[]):void` - установить массив Product в защищённое свойство items.
`get items(): IProduct[]` - получить массив Product из защищенного свойства items.
`getProduct(string: id): IProduct` - получить конкретный Product по id.
4. Basket.
Наследуется от базового класса Model. Представляет собой модель для коллекции товаров в корзине, используется для хранения и обработки данных о товарах в корзине.
Хранит список объектов, которые поддерживают интерфейс IProductItem(чтобы иметь доступ к методам конвертации).
В корзину нельзя добавить 2 или более одинаковых товаров. При добавлении или удалении товаров генерируется событие
'basket:items-changed', после чего BasketItemView и BasketView перерисовывает элементы корзины.
Конструктор не принимает аргументов.
Содержит следующие поля:
`_items: IProduct[]` - массив объектов - товаров.
Имеет методы:
`add(product: IProduct): void` - добавить товар в корзину.
`remove(id: string): void` - удалить товар из корзины по id.
`get items(): IProduct[]` - получить массив объектов - товаров из защищенного свойства items.
`get total(): number` - получить количество товаров в каталоге.
5. Order.
Наследуется от базового класса Model. Представляет собой модель для заказа, используется длял хранения и обработки данных о заказе.
Конструктор не принимает аргументов.
Содержит следующие поля:
`_paymentMethod: PaymentMethod` - способ оплаты.
`_address: string` - адрес.
`_email: string` - email.
`_phone: string` - номер телефона.
Имеет методы:
`get paymentMethod(): PaymentMethod` - возвращает способ оплаты.
`set paymentMethod(paymentMethodData: PaymentMethod): void` - устанавливает способ оплаты.
`get address(): string` - возвращает адрес.
`set address(addressData: string): void` - устанавливает адрес.
`get email(): string` - возвращает email.
`set email(emailData: string): void` - устанавливает email.
`get phone(): string` - возвращает номер телефона.
`set phone(phoneData: string): void` - устанавливает номер телефона.
6. OrderBuilder.
Представляет собой билдер для Order и реализует паттерн "builder". Нужен для поэтапного формирования заказа.
Конструктор не принимает аргументов.
Содержит следующие поля:
`order: IOrder` - экземпляр класса Order, который позже будет модифицирован методами.
Методы (они же этапы формирования заказа):
`setDelivery(delivery: IDelivery): void` - установка данных о доставке (адрес, способ оплаты).
`setContacts(contacts: IContacts): void` - установка контактных данных (телефон, email).
`setOrderList(orderList: IOrderList)` - установка данных о купленных товарах.
`getResult(): IOrder` - возвращает объект заказа.
###Компоненты представления:
1. Modal.
Наследуется от базового класса View. Отвечает за отображение модального окна и действий над ним. В конструктор на вход принимает HTMLElement и EventEmitter.
Имеются свойства, хранящие html элементы, closeButton и content.
Конструктор принимает такие аргументы:
`container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
`events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.
Содержит следующие поля:
`closeButton: HTMLButtonElement` - кнопка закрытия модального окна.
`content: HTMLElement` - содержимое модального окна.
`events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.
Имеет методы:
`set content(value: HTMLElement): void` - нужен, чтобы менять контент модального окна. Так как в проекте существует 5 видов модальных окон (информация о товаре,
содержимое корзины, форма доставки, форма контактов, окно успешной покупки) данный сеттер может использоваться, чтобы не создавать для каждого модального окна
отдельный объект, а использовать один и менять там контент.
`open(): void` - отображает модальное окно
`close(): void` - скрывает модальное окно
2. Form.
Наследуется от базового класса View. Отвечает за ui элемент формы и действий над ним. В конструктор на вход принимает HTMLElement и EventEmitter.
Имеет свойство, хранящий html элемент кнопки формы - submit. При вводе чего-либо в текстовом поле или при нажатии кнопки submit генерируются
соответствующие события через брокер событий.
Конструктор принимает такие аргументы:
`container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
`events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.
Содержит следующие поля:
`submitButton: HTMLButtonElement` - кнопка отправки формы.
`events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.
Имеет методы:
`set valid(value: boolean)` - для блокировки / разблокировки кнопки submit.
3. CardView.
Наследуется от базового класса View. Отвечает за ui элемент карточки на главной странице и действий над ним. Содержит поля - html элементы, такие как
категория товара, имя товара, изображение товара, цена товара и геттеры / сеттеры для них. Сеттеры нужны для автоматического назначения значений в html элементы при вызове метода render.
При клике на карточку генерируется событие 'card:select'.
Конструктор принимает такие аргументы:
`blockName: string` - БЭМ имя блока для поиска элементов внутри container через querySelector.
`container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
`actions?: ICardActions` - объект c обработчиком события на клик
Содержит следующие поля:
`_category: string` - категория товара.
`_title: string` - имя товара.
`_image: string` - ссылка на изображение товара.
`_price: string` - цена товара в виде строки.
Содержит методы:
`get category(): string` - возвращает категорию товара.
`set category(catagoryData: string): void` - устанавливает категорию товара.
`get title(): string` - возвращает имя товара.
`set title(titleData: string): void` - устанавливает имя товара.
`get image(): string` - возвращает ссылку на изображение товара.
`set image(imageData: string): void` - устанавливает ссылку на изображение товара.
`get price(): string` - возвращает цену товара.
`set price(priceData: string): void` - устанавливает цену товара.
`lockButton(): void` - блокировка кнопки.

4. CatalogView.
Наследуется от базового класса View. Отвечает за отображение контейнера для карточек на главной странице.
Конструктор принимает такие аргументы:
`container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
`events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.
Содержит следующие поля:
`events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.
`items: IProductCardUI` - массив объектов товара в удобном для данного класса формате.
Содержит методы:
`set items(card: IProductCardUI): void` - для установки элементов (списка карточек).
5. BasketItemView.
Наследуется от базового класса View. Отвечает за отображение отдельного товара в корзине. Содержит поля - html элементы карточки товара, такие как
индекс товара, имя товара, цена. кнопка удаления. При клике по кнопке удаления генерируется событие 'basket:item-changed'.
Конструктор принимает такие аргументы:
`blockName: string` - БЭМ имя блока для поиска элементов внутри container через querySelector.
`container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
`actions?: IBasketItemActions` - объект c обработчиком события на клик
Содержит следующие поля:
`_title: string` - имя товара.
`_price: string` - цена товара в виде строки.
`button: HTMLElement` - кнопка удаления
Содержит методы:
`get title(): string` - возвращает имя товара.
`set title(titleData: string): void` - устанавливает имя товара.
`get price(): string` - возвращает цену товара.
`set price(priceData: string): void` - устанавливает цену товара.
6. BasketView.
Наследуется от базового класса View. Отвечает за отображение контейнера c корзиной. Кнопка "оформить"  активна, если  в корзине есть товары. При клике на кнопку у объекта OrderBuilder вызывается метод setOrderList.
Конструктор принимает такие аргументы:
`container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
`events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.
Содержит следующие поля:
`events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.
`items: IBasketItemUI` - массив объектов - товаров в удобном для данного класса формате.
Содержит методы:
`set items(card: IBasketItemUI): void` - для установки элементов (списка товаров в корзине).
### Также необходимы дополнительные компоненты для формирования контента модальных окон, такие как ProductView, BasketView(описано ранее),
DeliveryView, ContactsView, SuccessView. Содержимое будет передано в сеттер контента Modal.
1. ProductView.
Наследуется от базового класса View. Отображает подробную информацию о товаре после клика по карточке(название товара, категория, изображение, цена)
и кнопку "купить". При клике на эту кнопку генерируется событие "basket:items-changed".
Конструктор принимает такие аргументы:
`container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
`actions?: IProductActions` - объект c обработчиком события на клик.
Содержит следующие поля:
`button: HTMLElement` - кнопка "купить".
Своих методов не имеет, но выполняет коллбэк, приходящий в конструктор.
2. DeliveryView.
Наследуется от класса Form. Представляет собой форму для ввода данных о доставке (способ оплаты, адрес) и кнопку "далее". Кнопка становится активна после
ввода всех требуемых данных. При клике на кнопку у объекта OrderBuilder вызывается метод setDelivery.
Конструктор принимает такие аргументы:
`container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
`actions?: IDeliveryActions` - объект c обработчиком события на клик.
Содержит следующие поля:
`submitButton: HTMLElement` - кнопка "далее".
Своих методов не имеет, но выполняет коллбэк, приходящий в конструктор.
3. ContactsView.
Наследуется от класса Form. Представляет собой форму для ввода контактных данных (email, телефон) и кнопку "далее". Кнопка становится активна после
ввода всех требуемых данных. При клике на кнопку у объекта OrderBuilder вызывается метод setContacts.
Конструктор принимает такие аргументы:
`container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
`actions?: IContactsActions` - объект c обработчиком события на клик.
Содержит следующие поля:
`submitButton: HTMLElement` - кнопка "далее".
Своих методов не имеет, но выполняет коллбэк, приходящий в конструктор.
4. SuccessView.
Наследуется от класса View. Представляет собой окно для показа информации об успешной покупке, содержит кнопку "за новыми покупками!". При клике на кнопку
модальное окно закрывается, корзина очищается.
Конструктор принимает такие аргументы:
`container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
`actions?: ISuccessActions` - объект c обработчиком события на клик.
Содержит следующие поля:
`button: HTMLElement` - кнопка "За новыми покупками!".
Своих методов не имеет, но выполняет коллбэк, приходящий в конструктор.

### Основные типы / интерфейсы:
```
interface IProductItem {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  image: string;
}

interface IProductItemUI {
  title: string;
  description: string;
  category: string;
  price: string;
  image: string;
}
type IProductCardUI = Pick<IProductItemUI, 'title' | 'category' | 'price' | 'image'>
type IBasketItemUI = Pick<IProductItemUI, 'title' | 'price'>;


type PaymentMethod = 'cash' | 'online';

interface IDelivery {
  payment: PaymentMethod;
  address: string;
}

interface IContacts {
  email: string;
  phone: string;
}

interface IOrderList {
  total: number;
  items: string[];
}

type IOrder = IDelivery & IContacts & IOrderList;

interface IOrderBuilder {
  setDelivery(delivery: IDelivery): void;
  setContacts(contacts: IContacts):void;
  setOrderList(orderList: IOrderList): void;
  getResult(): IOrder;
}

interface IOrderResult {
  id: string;
  total: number;
}

interface IShopApi {
  getProductList(): Promise<IProductItem[]>;
  getProductItem(id:string): Promise<IProductItem>;
  postOrder(order: IOrder): Promise<IOrderResult>;
}
```
