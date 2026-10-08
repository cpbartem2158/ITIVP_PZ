const store = require('../data/tickets');

const DEFAULT_STATUS = 'Новая';
const DEFAULT_PRIORITY = 'Средний';

// Номер заявки: только цифры без нуля впереди, не длиннее 15 знаков (безопасное целое).
const ID_PATTERN = /^[1-9]\d{0,14}$/;

// Управляющие символы. В описании разрешены перенос строки и табуляция.
const CONTROL_SINGLE_LINE = /[\u0000-\u001F\u007F]/;
const CONTROL_MULTI_LINE = /[\u0000-\u0008\u000B-\u001F\u007F]/;

const TEXT_FIELDS = [
  { name: 'title', label: 'Тема', multiline: false },
  { name: 'description', label: 'Описание', multiline: true },
  { name: 'author', label: 'Автор', multiline: false },
];

const SELECT_FIELDS = [
  { name: 'status', label: 'Статус', allowed: store.STATUSES, fallback: DEFAULT_STATUS },
  { name: 'priority', label: 'Приоритет', allowed: store.PRIORITIES, fallback: DEFAULT_PRIORITY },
];

function emptyForm() {
  return {
    title: '',
    description: '',
    status: DEFAULT_STATUS,
    priority: DEFAULT_PRIORITY,
    author: '',
  };
}

// Проверка одного текстового поля. Возвращает очищенное значение и сообщение об ошибке.
function checkText(field, raw) {
  if (raw === undefined) {
    return { value: '', error: `${field.label}: обязательное поле.` };
  }

  // Повтор поля (массив), объект, число, null из JSON — всё это не одна строка.
  if (typeof raw !== 'string') {
    return { value: '', error: `${field.label}: некорректное значение.` };
  }

  const value = raw.replace(/\r\n?/g, '\n').trim();
  if (value === '') {
    return { value, error: `${field.label}: обязательное поле.` };
  }

  const controlChars = field.multiline ? CONTROL_MULTI_LINE : CONTROL_SINGLE_LINE;
  if (controlChars.test(value)) {
    return { value, error: `${field.label}: недопустимые управляющие символы.` };
  }

  // Array.from считает символ вне BMP (например, эмодзи) за один знак.
  const length = Array.from(value).length;
  const { min, max } = store.LIMITS[field.name];
  if (length < min || length > max) {
    return { value, error: `${field.label}: от ${min} до ${max} символов.` };
  }

  return { value, error: null };
}

// Разбор тела запроса. Возвращает значения для формы и список ошибок.
function parseForm(body) {
  const source = body && typeof body === 'object' ? body : {};
  const values = {};
  const errors = [];

  TEXT_FIELDS.forEach((field) => {
    const result = checkText(field, source[field.name]);
    values[field.name] = result.value;
    if (result.error) {
      errors.push(result.error);
    }
  });

  SELECT_FIELDS.forEach((field) => {
    const raw = source[field.name];
    if (typeof raw === 'string' && field.allowed.includes(raw)) {
      values[field.name] = raw;
    } else {
      values[field.name] = field.fallback;
      errors.push(`${field.label}: выберите значение из списка.`);
    }
  });

  return { values, errors };
}

function renderAdd(res, statusCode, errors, form) {
  res.status(statusCode).render('add', {
    title: 'Новая заявка',
    errors,
    form,
    limits: store.LIMITS,
    statuses: store.STATUSES,
    priorities: store.PRIORITIES,
  });
}

function list(req, res) {
  res.render('index', {
    title: 'Список заявок',
    tickets: store.getAll(),
  });
}

function show(req, res, next) {
  // Строгая проверка: Number() пропустил бы 1e0, 0x1, 01, 1.0 и " 1".
  if (!ID_PATTERN.test(req.params.id)) {
    return next();
  }

  const ticket = store.getById(Number(req.params.id));
  if (!ticket) {
    return next();
  }

  res.render('item', {
    title: ticket.title,
    ticket,
  });
}

function showAddForm(req, res) {
  renderAdd(res, 200, [], emptyForm());
}

function create(req, res) {
  const { values, errors } = parseForm(req.body);
  if (errors.length > 0) {
    return renderAdd(res, 400, errors, values);
  }

  store.addTicket(values);
  res.redirect('/?auth=1');
}

function login(req, res) {
  res.render('login', {
    title: 'Вход',
  });
}

module.exports = {
  list,
  show,
  showAddForm,
  create,
  login,
};
