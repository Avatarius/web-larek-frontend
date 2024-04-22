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

## Об архитектуре.

В основе приложения лежит архитектура MVP(Model-View-Presentor) и включает в себя:
+ Model - модель данных, отвечает за хранение и обработку информации.
+ View - отвечает за отображение данных в ui элементах страницы.
+ Presentor - Соединяет модель и отображение, следит за изменениями модели и передаёт их в представление и наоборот. В данном случае не будет выделено отдельной сущности для этого, его роль будет выполнять код в index.ts.

Взаимодействия внутри приложения происходят через события. Модели инициализируют события, слушатели событий в основном коде выполняют передачу данных компонентам отображения, а также вычислениями между этой передачей, и еще они меняют значения в моделях.

## Документация классов

## Базовый код:

### 1. Api. Базовый класс для осуществления низкоуровневых операций с api.
#### Конструктор принимает такие аргументы:
+ `baseUrl: string` - базовый url на api.
+ `options: RequestInit` - объект с настройками для формирования запроса.

#### Содержит следующие поля:
+ `baseUrl: string` - базовый url на api.
+ `options: RequestInit` - объект с настройками для формирования запроса.

#### Имеет методы:
+ `get(uri: string)` - отправить get запрос на сервер.
+ `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - отправить post запрос на сервер с данными data.
+ `handleResponse(response: Response): Promise<object>` - обработка ответа с сервера. Если ответ с сервера в порядке, то возвращается json, в ином случае ошибка.

### 2. EventEmitter. Брокер событий, реализует паттерн "Наблюдатель", позволяет подписываться на события и уведомлять подписчиков о наступлении события, поддерживает интерфейс IEvents.
#### Конструктор не принимает аргументов.

#### Содержит следующие поля:
+ `_events: Map<EventName, Set<Subscriber>>` - хранит события в виде Map, где ключём является строка или регулярное выражение, а значением сет коллбэков.

#### Имеет методы:
+ `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - для подписки на событие.
+ `off(eventName: EventName, callback: Subscriber)` - для отписки от события.
+ `emit<T extends object>(eventName: string, data?: T)` - для уведомления подписчиков о наступлении события.
+ `onAll(callback: (event: EmitterEvent) => void)` - для подписки на все события.
+ `offAll()` - для сброса всех подписчиков.
+ `trigger<T extends object>(eventName: string, context?: Partial<T>)` - делает коллбек триггер, генерирующий событие при вызове.

### 3. Model. Базовый абстрактный класс для всех классов - моделей для хранения и обработки данных, использует EventEmitter посредством ассоциации.
#### Конструктор принимает такие аргументы:
+ `data: Partial<T>` - объект с входными данными. Partial делает поля типа T опциональными.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит следующие поля:
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Имеет методы:
+ `emitChanges(event: string, payload?: object)` - уведомляет подписчиков об изменениях модели и передаёт данные payload, для этого используется EventEmitter.

### 4. View. Базовый абстрактный класс для всех классов - отображений , для отображения данных в UI элементах.
#### Конструктор принимает такие аргументы:
+ `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.

#### Содержит следующие поля:
+ `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.

#### Имеет методы:
+ `toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключение класса className на переданном html элементе(element).
+ `setText(element: HTMLElement, value: unknown)` - установка текста(value) в выбранный HTMLElement (element).
+ `setDisabled(element: HTMLElement, state: boolean)` - блокирует переданный html элемент(element), если state === true. В ином случае снимает блокировку.
+ `setHidden(element: HTMLElement)` - скрывает переданный html элемент(element).
+ `setVisible(element: HTMLElement)` - отображает переданный html элемент(element).
+ `setImage(element: HTMLImageElement, src: string, alt?: string)` - устанавливает url(аргумент src) в поле src переданного html элемента(element) и альтернативный текст(аргумент alt) в поле alt.
+ `render(data?: Partial<T>): HTMLElement` - отрисовывает компонент на странице и возвращает корневой html элемент. Рендер осуществляется за счёт присваивания переданных данных текущему экземпляру класса. Классы, которые наследуются от View должны иметь набор сеттеров для корректной обработки такого присваивания.

## Компоненты модели данных:

### 1. ShopApi. Наследуется от базового класса Api. Осуществляет работу api конкретно данного магазина, позволяет получить список товаров, конкретный товар или оформить заказ сервиса "Web ларёк".
#### Конструктор принимает такие аргументы:
+ `cdn: string` - url на изображения товаров.
+ `baseUrl: string` - базовый url на api.
+ `options?: RequestInit` - объект с настройками для формирования запроса.

#### Содержит следующие поля:
+ `cdn: string` - url на изображения товаров.

#### Имеет методы:
+ `getProductList(): IProductItem[]` - получает с сервера список товаров для дальнейшей передачи их в Catalog и отрисовки посредством CardView и CatalogView.
+ `getProductItem(id: string)` - получает с сервера конкретный товар по id. Эти данные нужны для формирования заказа.
+ `postOrder(order: IOrder): IOrderResult` - отправляет post запрос на сервер, содержащий данные о заказе. Для этого нужны данные о заказе (способ оплаты, адрес, email, телефон)
и информация о купленных товарах(их id, общая стоимость).

### 2. Catalog. Наследуется от базового класса Model. Представляет собой модель для коллекции товаров на главной странице, используется для хранения и обработки данных о коллекции товаров.
Хранит список объектов, которые поддерживают интерфейс IProduct(чтобы иметь доступ к методам конвертации).
При добавлении объектов генерируется событие 'catalog:items-changed', по которому Card и Page отрисовывают список карточек.
#### Конструктор принимает такие аргументы:
+ `data: Partial<T>` - объект с входными данными. Partial делает поля типа T опциональными.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит следующие поля:
+ `protected _items: IProduct[];` - массив объектов - товаров.

#### Имеет методы:
+ `set items(list: IProduct[]):void` - установить массив Product в защищённое свойство items.
+ `get items(): IProduct[]` - получить массив Product из защищенного свойства items.
+ `find(string: id): IProduct | undefined` - получить конкретный Product по id.

### 3. Basket. Наследуется от базового класса Model. Представляет собой модель для коллекции товаров в корзине, используется для хранения и обработки данных о товарах в корзине.
Хранит список объектов, которые поддерживают интерфейс IProduct.
В корзину нельзя добавить 2 или более одинаковых товаров. При добавлении или удалении товаров генерируется событие
'basket:items-changed', после чего BasketCard и BasketView перерисовывают элементы корзины.
#### Конструктор принимает такие аргументы:
+ `data: Partial<T>` - объект с входными данными. Partial делает поля типа T опциональными.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит следующие поля:
+ `_items: IProduct[]` - массив объектов - товаров.

#### Имеет методы:
+ `add(item: IProduct): void` - добавить товар в корзину.
+ `remove(id: string): void` - удалить товар из корзины по id.
+ `contains(id: string): boolean` - проверить содержится ли товар с данным id в корзине.
+ `clear(): void` - очистить корзину.
+ `get items(): IProduct[]` - получить массив объектов - товаров из защищенного свойства items.
+ `get total(): number` - получить общую стоимость всех товаров в корзине.
+ `get length(): number` - получить длинну массива _items.
+ `getIdList(): string[]` - получить массив id в виде строк.

### 4. Order. Представляет собой модель для заказа, используется для хранения и обработки данных о заказе.
#### Конструктор не принимает аргументов.

#### Содержит следующие поля:
+ `protected _payment: PaymentMethod` - способ оплаты.
+ `protected _address: string` - адрес.
+ `protected _email: string` - email.
+ `protected _phone: string` - номер телефона.
+ `protected _total: number` - общая стоимость всех товаров в заказе.
+ `protected _items: string[]` - список id товаров в виде строк.

#### Имеет методы:
+ `set payment(value: PaymentMethod): void` - устанавливает способ оплаты.
+ `set address(value: string): void` - устанавливает адрес.
+ `set email(value: string): void` - устанавливает email.
+ `set phone(value: string): void` - устанавливает номер телефона.
+ `set total(value: number): void` - устанавливает общую стоимость товаров в заказе.
+ `set items(list: string[]): void` - устанавливает список товаров заказа в виде массива из id.
+ `toApiObject(): IOrderData` - возвращает объект, пригодный для отправки api post запроса.

### 5. OrderBuilder. Представляет собой билдер для Order и реализует паттерн "builder". Нужен для поэтапного формирования заказа.
#### Конструктор принимает такие аргументы:
+ `data: Partial<T>` - объект с входными данными. Partial делает поля типа T опциональными.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит следующие поля:
+ `protected order: IOrder;` - экземпляр класса Order, который позже будет модифицирован методами.

#### Методы (они же этапы формирования заказа):
+ `set delivery(delivery: IDelivery): void` - установка данных о доставке (адрес, способ оплаты).
+ `set contacts(contacts: IContacts): void` - установка контактных данных (телефон, email).
+ `set orderList(orderList: IOrderList): void` - установка данных о купленных товарах.
+ `get result(): IOrder` - возвращает объект заказа.

## Компоненты представления:

### 1. Modal. Наследуется от базового класса View. Отвечает за отображение модального окна и действий над ним.
#### Конструктор принимает такие аргументы:
+ `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит следующие поля:
+ `protected _closeButton: HTMLButtonElement` - кнопка закрытия модального окна.
+ `protected _content: HTMLElement` - содержимое модального окна.
+ `protected events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Имеет методы:
+ `set content(value: HTMLElement): void` - нужен, чтобы менять контент модального окна. Так как в проекте существует 5 видов модальных окон (информация о товаре,
содержимое корзины, форма доставки, форма контактов, окно успешной покупки) данный сеттер может использоваться, чтобы не создавать для каждого модального окна
отдельный объект, а использовать один и менять там контент.
+ `open(): void` - отображает модальное окно
+ `close(): void` - скрывает модальное окно

### 2. Form. Наследуется от базового класса View. Отвечает за ui элемент формы и действий над ним. В конструктор на вход принимает HTMLElement и EventEmitter.
Имеет свойство, хранящий html элемент кнопки формы - submit. При вводе чего-либо в текстовом поле или при нажатии кнопки submit генерируются
соответствующие события через брокер событий.
#### Конструктор принимает такие аргументы:
+ `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит следующие поля:
+ `protected container: HTMLFormElement` - контейнер формы, переданный в конструкторе.
+ `protected inputList: HTMLInputElement[]` - список input элементов формы.
+ `protected _submit: HTMLButtonElement` - кнопка отправки формы.
+ `protected _error: HTMLSpanElement` - элемент для отображения ошибок формы.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Имеет методы:
+ `get valid(): boolean` - получения статуса валидности формы.
+ `set valid(value: boolean)` - для блокировки / разблокировки кнопки submit.
+ `set error(value: string)` - установка текста ошибок.
+ `clear()` - очистка формы.
+ `render(data?: Partial<T> & IFormState): HTMLElement` - отображение формы на странице, с присвоением нужных свойств.
+ `emitInput()` - оповещении о вводе текста формы.

### 3. Page. Наследуется от базового класса View. Отвечает за общие элементы страницы(кнопка корзины, список карточек, счётчик товаров в корзине).
#### Конструктор принимает такие аргументы:
+ `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит следующие поля:
+ `protected container: HTMLFormElement` - контейнер элемента, переданный в конструкторе.
+ `protected _basketButton: HTMLElement` - кнопка корзины, расположенная в элементе header.
+ `protected _catalog: HTMLElement` - список карточек на главной странице.
+ `protected _counter: HTMLSpanElement` - счётчик количества товаров в корзине.
+ `protected _wrapper: HTMLDivElement` - html элемент для обеспечения блокировку прокрутки.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Имеет методы:
+ `set catalog(items: HTMLElement[])` - устанавливает переданный список карточек как массив html элементов в элемент списка карточек посредством replaceChildren.
+ `set counter(value: string)` - устанавливает значение в счётчике товаров корзины.
+ `lockScroll(state: boolean): void` - блокировка прокрутки.

### 4. Card. Наследуется от базового класса View. Является базовым классом для всех классов - карточек. Отвечает за ui элемент карточки и действий над ним. Содержит поля - html элементы, такие как категория товара, имя товара, изображение товара, цена товара и геттеры / сеттеры для них. Сеттеры нужны для автоматического назначения значений в html элементы при вызове метода render.
#### Конструктор принимает такие аргументы:
+ `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит следующие поля:
+ `protected _id: string` - id товара.
+ `protected _title: HTMLHeadingElement` - html элемент, отвечающий за отображение имени товара.
+ `protected _price: HTMLSpanElement` - html элемент, отвечающий за отображение цены товара.
+ `protected events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит методы:
+ `get id(): string` - возвращает id товара.
+ `set id(value: string)` - устанавливает id товара в поле _id.
+ `get title(): string` - возвращает имя товара.
+ `set title(titleData: string): void` - устанавливает имя товара в html элемент _title.
+ `get price(): string` - возвращает цену товара.
+ `set price(priceData: string): void` - устанавливает цену товара в html элемент _price.

### 5. CatalogCard. Наследуется от класса Card. Отвечает за ui элемент карточки на главной странице и действий над ним. Содержит поля - html элементы, такие как категория товара, имя товара, изображение товара, цена товара и геттеры / сеттеры для них. Сеттеры нужны для автоматического назначения значений в html элементы при вызове метода render. При клике на карточку генерируется событие 'card:select'.
#### Конструктор принимает такие аргументы:
+ `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит следующие поля:
+ `protected _category: HTMLSpanElement` - html элемент, отвечающий за отображение категории товара.
+ `protected _image: HTMLImageElement` - html элемент, отвечающий за отображение изображения товара.

#### Содержит методы:
+ `protected toggleCategoryClass(value: string): void` - назначает соответствующий класс - модификатор на html элемент категории.
+ `get category()` - возвращает категорию товара.
+ `set category(value: string)` - устанавливает категорию товара в html элемент _category.
+ `set image(value: string): void` - устанавливает изображение товара в html элемент _image.

### 6. PreviewCard. Наследуется от класса CatalogCard. Отвечает за ui элемент карточки в модальном окне после клика по карточке на главной странице. Содержит поля - html элементы, такие как категория товара, имя товара, изображение товара, цена товара и геттеры / сеттеры для них. Сеттеры нужны для автоматического назначения значений в html элементы при вызове метода render.
#### Конструктор принимает такие аргументы:
+ `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит следующие поля:
+ `protected _description: HTMLParagraphElement` - html элемент, отвечающий за отображение описания товара.
+ `protected button: HTMLButtonElement` - кнопка "купить" или "удалить".

#### Содержит методы:
+ `set description(value: string): void` - устанавливает описание товаара в html элемент _description.
+ `set valid(state: boolean): void` - устанавливает валидность ui элемента, отключая кнопка. В данном случае кнопка отключается если в модальном окне открыт бесценный товар.
+ `set state(state: boolean): void` - устанавливает состояние кнопки, может быть всего 2 варианта: купить(true), удалить(false).


### 7. BasketCard. Наследуется от класса Card. Отвечает за отображение отдельного товара в корзине. При клике по кнопке удаления генерируется событие 'basket:item-changed'.
#### Конструктор принимает такие аргументы:
+ `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит следующие поля:
+ `protected _index: HTMLSpanElement;` - html элемент, отвечающий за отображение порядкового номера товара в корзине.
+ `protected button: HTMLButtonElement` - кнопка удаления товара из корзины.

#### Содержит методы:
+ `set index(value: number): void` - установка порядкового номера в html

### 8. BasketView. Наследуется от базового класса View. Отвечает за отображение контейнера c корзиной. Кнопка "оформить"  активна, если  в корзине есть товары. При клике на кнопку у объекта OrderBuilder вызывается метод `set orderList(orderList: IOrderList)`.
#### Конструктор принимает такие аргументы:
+ `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит следующие поля:
+ `protected _list: HTMLElement` - html элемент, отвечающий за отображение списка карточек.
+ `protected _price: HTMLSpanElement;` - html элемент, отвечающий за отображение общей стоимости товаров.
+ `protected button: HTMLButtonElement` - кнопка "оформить".
+ `protected events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит методы:
+ `set list(items: HTMLElement[]): void` - для установки элементов (html списка карточек в корзине) посредством replaceChildren.
+ `set valid(state: boolean)` - устанавливает валидность ui элемента, блокируя кнопку. В данном случае кнопка блокоируется, если корзина пуста.
+ `set price(value: number)` - устанавливает общую стоимость товаров в html элемент _price.

### 9. OrderView. Наследуется от базового класса Form. Отвечает за ui элемент формы заказа(адрес, способ оплаты).
#### Конструктор принимает такие аргументы:
+ `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит следующие поля:
+ `protected buttonContainer: HTMLDivElement` - контейнер, содержащий кнопки "онлайн" и "при получении".
+ `protected onlineButton: HTMLButtonElement;` - кнопка "онлайн".
+ `protected cashButton: HTMLButtonElement` - кнопка "при получении".

#### Содержит методы:
+ `protected getActiveButton(): HTMLButtonElement | null` - возвращает кнопку , у которой активен класс 'button_alt-active', либо undefined , если этот класс не активен не у одной кнопки.
+ `clear(): void` - Очищает форму и снимает класс 'button_alt-active' с обеих кнопок.
+ `get payment(): string` - возращает способ оплаты в зависимости от нажатой кнопки.
+ `get address(): string` - возвращает адрес из поля ввода address.
+ `get valid(): boolean` - возвращает валидность формы. В данном случае форма валидна, если была нажата одна из кнопок и в поле ввода не пустое значение.
+ `set valid(value: boolean)` - устанавливает валидность формы, блокируя кнопку. В данном случае форма валидна, если была нажата одна из кнопок и в поле ввода не пустое значение.

### 10. ContactsView. Наследуется от базового класса Form. Отвечает за ui элемент формы контактов(email, телефон).
#### Конструктор принимает такие аргументы:
+ `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Cобственных уникальных полей не имеет.

#### Содержит методы:
+ `get email(): string` - возвращает email из поля ввода email.
+ `get phone(): string` - возвращает номер телефона из поля ввода phone.

### 11. SuccessView. Наследуется от класса View. Представляет собой окно для показа информации об успешной покупке, содержит кнопку "за новыми покупками!". При клике на кнопку модальное окно закрывается, корзина очищается.
#### Конструктор принимает такие аргументы:
+ `container: HTMLElement` - DOM элемент, контейнер для дочерних элементов.
+ `events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.

#### Содержит следующие поля:
+ `protected button: HTMLButtonElement;` - кнопка "за новыми покупками".
+ `protected events: IEvents` - объект, являющимся брокером событий, поддерживает интерфейс IEvents.
+ `protected description: HTMLParagraphElement` - html элемент, отвечающий за отображение потраченных средств. Например, списано 1200 синапсов.

#### Содержит методы:
+ `set total(value: number)` - устанавливает количество потраченных средств в html элемент description.

## Основные типы / интерфейсы:
```
interface IModel {
	emitChanges(event: string, data?: object): void;
}

interface IView<T> {
	toggleClass(element: HTMLElement, className: string, force?: boolean): void;
	setText(element: HTMLElement, value: unknown): void;
	setDisabled(element: HTMLElement, state: boolean): void;
	setHidden(element: HTMLElement): void;
	setVisible(element: HTMLElement): void;
	setImage(element: HTMLElement, src: string, alt?: string): void;
	render(data?: Partial<T>): HTMLElement;
}

interface IProduct {
	id: string;
	title: string;
	description: string;
	category: string;
	price: number;
	image: string;
}

interface IIdentifier {
	id: string;
}

type ICatalogCard = Omit<IProduct, 'description'>;
type IPreviewCard = IProduct & { valid: boolean; state: boolean };
type IBasketCard = Omit<IProduct, 'description' | 'category' | 'image'> & {
	index: number;
};

type PaymentMethod = 'cash' | 'card';

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

type IOrderData = IDelivery & IContacts & IOrderList;

interface IOrderBuilder {
	delivery: IDelivery;
	contacts: IContacts;
	orderList: IOrderList;
	result: IOrderData;
}

interface IOrderResult {
	id: string;
	total: number;
}

interface IShopApi {
	getProductList(): Promise<IProduct[]>;
	getProductItem(id: string): Promise<IProduct>;
	postOrder(order: IOrderData): Promise<IOrderResult>;
}

interface IFormState {
	valid: boolean;
	error: string;
}

interface IForm extends IFormState {
	render(data?: IFormState): HTMLElement;
}

interface IInputData {
	field: string;
	value: string;
}

export type {
	IModel,
	IView,
	IShopApi,
	IProduct,
	IIdentifier,
	ICatalogCard,
	IPreviewCard,
	IBasketCard,
	PaymentMethod,
	IOrderData,
	IContacts,
	IOrderResult,
	IOrderList,
	IOrderBuilder,
	IDelivery,
	IFormState,
	IForm,
	IInputData,
};

```
