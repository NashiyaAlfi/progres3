const express = require('express')
const mysql = require('mysql')
const bodyParser = require('body-parser')
const app = express()
const jwt = require('jsonwebtoken')
const secretKey = 'this is very secret Key'
const port = 2700;


const db = mysql.createConnection({
    host: '127.0.0.1',
    port: '3306',
    user: 'root',
    password: '',
    database: "corona"
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: true
}))

const Authorized = (request, result, next) => {
    if (typeof(request.headers['x-api-key']) == 'undifined'){
    return result.status(403).json({
        success: false,
        message:'Unauthorized. Token is not provided'
    })
}

let token = request.headers['x-api-key']

jwt.verify(token, secretKey, (err, decoded) => {
    if (err){
        return result.status(401).json({
            success:false,
            message:'Unauthorized. Token is invalid'
        })
    }
})

next()
}

/* list end point */
app.get('/',(request,result) => {
    result.json({
        success:true,
        message:'Welcome'
    })
})

/* Login untuk mendapatkan token */

app.post('/login', (request,result)=>{
    let data = request.body

    if(data.username == 'admin'&&data.password == 'admin'){
        let token = jwt.sign(data.username+'|'+data.password,secretKey)

        result.json({
            success:true,
            message:'Login success, welcome back Admin',
            token:token 
        })
    }
    result.json({
        success:false,
        message:'you are not person with username admin and have password admin!'
    })
})

/* CRUD Pelanggan */

app.get('/pengguna', Authorized,(req, res) => {
    let sql = `
        select username, created_at from pengguna 
    `
    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "pengguna, masuk sukses!!",
            data: result 
        })
    })
})

app.post('/pengguna', Authorized, (req, res) => {
    let data = req.body

    let sql = `
        insert into pengguna (username, password)
        values ('`+data.username+`','`+data.password+`')
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "pengguna, sukses!!",
            data: result
        })
    })
})

app.get('/pengguna/:id', Authorized,(req, res)=> {
    let sql = `
        select * from pengguna
        where id = `+req.params.id+`
        limit 1
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json ({
            message: "pengguna, sukses!!",
            data: result[0]
        })
    })
})

app.put('/pengguna/:id', Authorized,(req, res) => {
    let data = req.body

    let sql = `
        update pengguna
        set username = '`+data.username+`', password = '`+data.password+`'
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "pengguna, update sukses",
            data: result
        })
    })
})

app.delete('/pengguna/:id', Authorized,(req, res) => {
    let sql = `
        delete from pengguna
        where id = '`+req.params.id+`'
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "pengguna, delete sukses!!",
            data: result
        })
    })
})

/* CRUD Daerah */

app.get('/daerah', Authorized,(req, res) => {
    let sql = `
        SELECT * FROM daerah
    `
    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "Berhasil",
            data: result 
        })
    })
})

app.get('/daerah', Authorized,(req, res) => {
    let sql = `
        SELECT * FROM daerah WHERE id = '`+req.params.id+`'
    `

    db.query(sql, (err, result) => {
        if (err) throw err
        res.json({
            message: "Berhasil",
            data: result 
        })
    })
})

app.post('/daerah', Authorized, (req, res) => {
    let data = req.body

    let sql = `
        insert into daerah (nama_daerah, call_center, rumahsakit_rujukan, 
        alamat, jml_penderita)
        values ('`+data.nama_daerah+`','`+data.call_center+`','`+data.rumahsakit_rujukan+`'
        ,'`+data.alamat+`', '`+data.jml_penderita+`')
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "berhasil",
            data: result
        })
    })
})

app.put('/daerah/:id', Authorized, (req, res) => {
    let data = req.body

    let sql = `
        update daerah
        set nama_daerah = '`+data.nama_daerah+`', call_center = '`+data.call_center+`', 
        rumahsakit_rujukan = '`+data.rumahsakit_rujukan+`', alamat = '`+data.alamat+`', jml_penderita = '`+data.jml_penderita+`'
        where id = '`+req.params.id+`'
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "berhasil",
            data: result
        })
    })
})

app.delete('/daerah/:id', Authorized, (req, res) => {
    let sql = `
        delete from daerah
        where id = '`+req.params.id+`'
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "berhasil",
            data: result
        })
    })
})

/* CRUD Informasi */

app.get('/info', Authorized,(req, res) => {
    let sql = `
        SELECT * FROM informasi
    `
    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "Berhasil",
            data: result 
        })
    })
})

app.get('/info', Authorized,(req, res) => {
    let sql = `
        SELECT * FROM informasi WHERE id = '`+req.params.id+`'
    `

    db.query(sql, (err, result) => {
        if (err) throw err
        res.json({
            message: "Berhasil",
            data: result 
        })
    })
})

app.post('/info', Authorized, (req, res) => {
    let data = req.body

    let sql = `
        insert into informasi (informasi)
        values ('`+data.informasi+`')
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "berhasil",
            data: result
        })
    })
})

app.put('/info/:id', Authorized, (req, res) => {
    let data = req.body

    let sql = `
        update informasi
        set informasi = '`+data.informasi+`'
        where id = '`+req.params.id+`'
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "berhasil",
            data: result
        })
    })
})

app.delete('/info/:id', Authorized, (req, res) => {
    let sql = `
        delete from informasi
        where id = '`+req.params.id+`'
    `

    db.query(sql, (err, result) => {
        if (err) throw err

        res.json({
            message: "berhasil",
            data: result
        })
    })
})


/* Run Application */
app.listen(port, () => {
    console.log('app running on port ' + port)
})
