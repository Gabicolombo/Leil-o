import { serverHttp } from './http';
import './socket';

const port = process.env.PORT || 2828;

serverHttp.listen(port, () => console.log(`Server is running on PORT ${port}`));

//app.use(express.static(path.join(__dirname, 'public')))
//app.set('views', path.join(__dirname, 'public'))
//app.engine('html', require('ejs').renderFile)
//app.set('view engine', 'html')
