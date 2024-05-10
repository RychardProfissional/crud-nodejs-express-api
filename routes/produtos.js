const express = require('express')
const mysql = require('mysql')
const router = express.Router()

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'loja'
})

router.get('/', (req, res, next) => {
    res.status(200).json({
        Produtos: [
            {
                id: 1,
                description: '',
            }
        ]
    })
})

router.post('/', (req, res, next) => {
    const {id, description} = res.body
    if (!id || !description) {
        res.status(400).json({
            error: { message: 'Erro nos dados passados para a API'}
        })
        return
    }

    pool.getConnection((err, conn) => {
        if (err) {
            res.status(417).json({
                error: { message: 'Erro com ao tentar se conectar com o banco de dados' }
            })
            return
        }
        
        conn.query("INSERT INTO `produtos` VALUES (?, ?)", [id, description], (qErr, results) => {
            if (qErr) {
                res.status(500).json({
                    error: {message: 'Erro ao tentar incerrir valor no banco de dados'}
                })
                return
            }

            res.status(200).json({
                menssage: 'produto cadastrado'
            })
        })

        conn.release()
    })
})

router.patch('/', (req, res, next) => {
    res.status(200).json({
        menssage: 'produto modificado'
    })
})

router.delete('/', (req, res, next) => {
    res.status(200).json({
        menssage: 'produto deletado'
    })
})

module.exports = router