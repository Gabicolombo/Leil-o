const {serverHttp} = require('./http');
require('./socket');

const port = process.env.PORT || 2828;

serverHttp.listen(port, () => console.log(`Server is running on PORT ${port}`));

