const {serverHttp} = require('./http');
const cron = require('node-cron');
const { Socket } = require('./socket');

const port = process.env.PORT || 2828;

// cron.schedule('*/5 * * * * *', () => {
//   const rooms = Socket.rooms;
//   Object.keys(rooms).forEach(async (key) => {
//     const { startDate } = rooms[key];
//     if (new Date() > new Date(startDate)) {
//       console.log('começou', key);
//       await Socket.decrementTime(key);
//     }
//   });
//   console.log(Socket.rooms);
// });

serverHttp.listen(port, () => console.log(`Server is running on PORT ${port}`));

