// Имитация входа: ?auth=1 — оператор, иначе гость.
// Список и карточка доступны гостю. Добавление заявки закрыто requireAuth.
function attachUser(req, res, next) {
  const authorized = req.query.auth === '1';

  req.user = authorized
    ? { name: 'Оператор', authorized: true }
    : { name: 'Гость', authorized: false };

  res.locals.user = req.user;
  res.locals.authSuffix = authorized ? '?auth=1' : '';
  next();
}

function requireAuth(req, res, next) {
  if (req.user && req.user.authorized) {
    return next();
  }

  return res.redirect('/login');
}

module.exports = {
  attachUser,
  requireAuth,
};
