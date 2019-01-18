const express = require('express')
const path = require('path')

const PORT = process.env.PORT || 5000

const app = express()

var expressValidator = require('express-validator');
var expressSession = require('express-session');
app.use(expressSession({secret: "Secret Key", saveUninitialized: false, resave: false}))
app.set('views', path.join(__dirname, 'src/views'))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')

const userRouter = require(path.join(__dirname,'src/routes/user'));
const itemRouter = require(path.join(__dirname,'src/routes/items'));
app.use('/', userRouter)
app.use('/', itemRouter)
// app.get('/', (req, res)=> {
// 	res.render('index', {pageview: req.session.currentuser, currentusername: req.session.currentusername, post: "Index"});
// })

app.listen(PORT, () => console.log(`Listening on ${ PORT }`))
