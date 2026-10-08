const CLIENT_MESSAGES = {
  400: 'Запрос составлен некорректно.',
  413: 'Слишком большой запрос. Сократите текст.',
};

function notFound(req, res) {
  res.status(404).render('404', {
    title: 'Страница не найдена',
    requestedUrl: req.originalUrl,
  });
}

// Четыре параметра — признак error-handling middleware в Express.
function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }

  // Ошибки клиента (битый URL, слишком большое или некорректное тело запроса)
  // не считаются сбоем сервера: отвечаем 4xx, а не 500.
  const status = err.status || err.statusCode;
  if (status >= 400 && status < 500) {
    console.warn(`Некорректный запрос (${status}): ${err.message}`);
    return res.status(status).render('400', {
      title: 'Некорректный запрос',
      status,
      message: CLIENT_MESSAGES[status] || CLIENT_MESSAGES[400],
    });
  }

  console.error(err);
  res.status(500).render('500', {
    title: 'Ошибка сервера',
  });
}

module.exports = {
  notFound,
  errorHandler,
};
