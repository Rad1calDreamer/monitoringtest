var routes = require('./routes');
module.exports = function(app, db) {
   routes(app, db);
   // Тут, позже, будут и другие обработчики маршрутов
};