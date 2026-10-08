const express = require('express');
const path = require('path');

const requestLogger = require('./middleware/logger');
const { attachUser } = require('./middleware/auth');
const { notFound, errorHandler } = require('./middleware/errors');
const ticketsRouter = require('./routes/tickets');

const app = express();
const PORT = process.env.PORT || 3000;

// Предел тела запроса. Запас рассчитан на 1000 эмодзи в описании в виде %XX.
const BODY_LIMIT = '32kb';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Журнал и пользователь идут до разбора тела: страницы ошибок парсера
// используют req.user и authSuffix в шапке.
app.use(requestLogger);
app.use(attachUser);
app.use(express.urlencoded({ extended: false, limit: BODY_LIMIT }));
app.use(express.json({ limit: BODY_LIMIT }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(ticketsRouter);

// Служебный адрес, чтобы открыть страницу 500 и увидеть запись в консоли.
app.get('/cause-error', (req, res, next) => {
  next(new Error('Проверка middleware обработки ошибок'));
});

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});
