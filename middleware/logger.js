// Выводит метод, URL и время запроса. После ответа дописывает код и длительность.
function requestLogger(req, res, next) {
  const startedAt = Date.now();
  const time = new Date().toLocaleString('ru-RU');

  res.on('finish', () => {
    const durationMs = Date.now() - startedAt;
    console.log(`${time}  ${req.method} ${req.originalUrl}  ${res.statusCode}  ${durationMs} мс`);
  });

  next();
}

module.exports = requestLogger;
