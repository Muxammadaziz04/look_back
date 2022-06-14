const path = require('path')
const fs = require('fs')

function getFile(filename){
    let file = fs.readFileSync(path.join(__dirname,'../', 'databace', `${filename}.json`), 'utf-8')
    file = JSON.parse(file)
    return file
}


function getImg(imgname){
    let img = fs.readFileSync(path.join(__dirname,'../', 'databace', 'img', `${imgname}.jpeg`))
    return img
}


function writeFile(filename, data){
    let file = getFile(filename)
    file.push(data)
    fs.writeFileSync(path.join(__dirname, '../', 'databace', `${filename}.json`), JSON.stringify(file, null, 4))
}


function getData(req, filename, needId = true){
    let body = req.body
    console.log(body);
    let data = getFile(filename)
    let id = data.length ? +data.at(-1)[`${filename.slice(0,-1)}Id`] + 1 : 1

    let user = {...body}
    if(needId) user[`${filename.slice(0,-1)}Id`] = id

    return user
}

module.exports = { getFile, writeFile, getData, getImg }