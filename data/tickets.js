const STATUSES = ['Новая', 'В работе', 'Решена', 'Закрыта'];
const PRIORITIES = ['Низкий', 'Средний', 'Высокий'];

// Допустимая длина текстовых полей в символах (после обрезки пробелов).
const LIMITS = {
  title: { min: 3, max: 100 },
  description: { min: 10, max: 1000 },
  author: { min: 2, max: 60 },
};

const tickets = [
  {
    id: 1,
    title: 'Не открывается корпоративная почта',
    description: 'Outlook показывает ошибку подключения к серверу. Письма не приходят с утра.',
    status: 'В работе',
    priority: 'Высокий',
    author: 'Иванова Анастасия Сергеевна.',
  },
  {
    id: 2,
    title: 'Не печатает принтер на третьем этаже',
    description: 'Принтер HP в кабинете 312 не берёт задание из очереди.',
    status: 'Новая',
    priority: 'Средний',
    author: 'Петров Иван Владимирович.',
  },
  {
    id: 3,
    title: 'Сброс пароля в системе учёта заявок',
    description: 'Пользователь не может войти после смены пароля. Учётная запись не заблокирована.',
    status: 'Решена',
    priority: 'Низкий',
    author: 'Сидорова Мария Константиновна.',
  },
  {
    id: 4,
    title: 'Нет доступа к сетевой папке отдела',
    description: 'При открытии общей папки продаж появляется отказ в доступе.',
    status: 'В работе',
    priority: 'Высокий',
    author: 'Козлов Дмитрий Александрович.',
  },
  {
    id: 5,
    title: 'Медленно работает VPN',
    description: 'Подключение устанавливается, но страницы открываются с большой задержкой.',
    status: 'Новая',
    priority: 'Средний',
    author: 'Новикова Елена Петровна.',
  },
];

let nextId = 6;

function getAll() {
  return tickets;
}

function getById(id) {
  return tickets.find((ticket) => ticket.id === id);
}

function addTicket(fields) {
  const ticket = {
    id: nextId,
    title: fields.title,
    description: fields.description,
    status: fields.status,
    priority: fields.priority,
    author: fields.author,
  };

  nextId += 1;
  tickets.push(ticket);
  return ticket;
}

module.exports = {
  STATUSES,
  PRIORITIES,
  LIMITS,
  getAll,
  getById,
  addTicket,
};
