const {serverHttp} = require('./http');
const cron = require('node-cron');
const { Socket } = require('./socket');

const port = process.env.PORT || 2828;

/**
 * Rotina que executa a cada 1 minuto, verificando se existe alguma sala de leilão com a data de início
 * igual a data atual. Com isso, o leilão será iniciado de forma automática.
 * 
 */
cron.schedule('* * * * *', () => {
  const rooms = Socket.rooms;
  Object.keys(rooms).forEach(async (key) => {
    if ('startDate' in rooms[key] && 'hasStarted' in rooms[key]) {
      const { startDate, hasStarted } = rooms[key];
      if (new Date() > new Date(startDate) && hasStarted === false) {
        await Socket.startRoomTime(key);
      }
    }
  });
});

serverHttp.listen(port, () => console.log(`Server is running on PORT ${port}`));

