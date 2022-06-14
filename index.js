const express =  require("express")
const fs =  require('fs')
const path = require("path")
let { getFile, writeFile, getData, getImg } = require('./utils/utils')
let app = express()

app.use(express.json())
app.use('*', function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');
    next();
  });




app.get('/users', (req, res) => res.status(200).send(getFile('users')))
app.get('/orders', (req, res) => res.status(200).send(getFile('orders')))
app.get('/foods', (req, res) => res.status(200).send(getFile('foods')))
app.get('/img/:imgName', (req, res) => {
    let { imgName } = req.params
    res.end(getImg(imgName))
})


app.post('/users', (req, res) => {
    let user = getData(req, 'users')

    if(!(user.username && user.contact)) res.status(400).send({status:400, message: 'user not added'})
    writeFile('users', user)

    res.status(201).send({status:201, message: 'user added successfully'})
})


app.post('/foods', (req, res) => {
    let food = getData(req, 'foods')

    writeFile('foods', food)

    res.status(201).send({status:201, message: 'food added successfully'})
})


app.post('/orders', (req, res) => {
    let order = getData(req, 'orders', false)

    let orders = getFile('orders')

    let findedOrder = orders.find(el => el.userId == order.userId && el.foodId == order.foodId)

    if(findedOrder){
        findedOrder.count = +order.count + +findedOrder.count
        fs.writeFileSync(path.join(__dirname, 'databace', 'orders.json'), JSON.stringify(orders, null, 4))
    } else {
        writeFile('orders', order)
    }

    res.status(201).send({status:201, message: 'order added successfully'})
})



const PORT = process.env.PORT || 3000
app.listen(PORT, () => console.log(`Server is run on ${PORT} port`))