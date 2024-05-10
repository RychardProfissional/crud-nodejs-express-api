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
    pool.getConnection((err, conn) => {
        if (err) {
            res.status(417).json({
                error: { message: 'Erro com ao tentar se conectar com o banco de dados' }
            })
            return
        }

        conn.query("SELECT id, descricao, preco FROM `produtos`", (qErr, result) => {
            if (qErr) {
                res.status(500).json({
                    error: {message: qErr.sqlMessage}
                })
            }
            else if (!result.length) {
                res.status(404).json({
                    error: {message: "Não existe produtos no banco de dados"}
                })
            }
            else {
                res.status(200).json({Produtos: result})
            }
        })

        conn.release()
    })
})

router.get('/:id_produto', (req, res, next) => {
    const idProduto = req.params.id_produto
    if (!idProduto) {
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
        
        conn.query("SELECT descricao, preco FROM `produtos` WHERE `id` = ? LIMIT 1", [idProduto], (qErr, result) => {
            if (qErr) {
                res.status(500).json({
                    error: {message: qErr.sqlMessage}
                })
            } 
            else if (!result.length) {
                res.status(404).json({
                    error: {message: "Produto não encontrado"}
                })
            }
            else {
                res.status(200).json({...result[0]})
            }
        })
        conn.release()
    })
})

router.post('/', (req, res, next) => {
    const {descricao, preco} = req.body
    
    if (!descricao, !preco) {
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
        
        conn.query("INSERT INTO `produtos` (descricao, preco) VALUES (?, ?)", [descricao, preco], (qErr, result) => {
            if (qErr) {
                res.status(500).json({
                    error: {message: qErr.sqlMessage}
                })
            }
            else {
                res.status(200).json({
                    message: 'produto cadastrado'
                })
            }
        })

        conn.release()
    })
})

router.put('/:id_produto', (req, res, next) => {
    const idProduto = req.params.id_produto
    const {descricao, preco} = req.body

    if (!idProduto, !descricao, !preco) {
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
        
        conn.query(
            "UPDATE `produtos` SET `descricao` = ?, `preco` = ? WHERE `id` = ?", 
            [descricao, preco, idProduto], 
            (qErr, result) => {
                if (qErr) {
                    res.status(404).json({
                        error: {message: qErr.sqlMessage}
                    })
                }
                else if (!result.changedRows) {
                    res.status(404).json({
                        error: {message: "Produto não encontrado"}
                    })
                }
                else {
                    res.status(200).json({
                        message: "Produto atualizado com sucesso"
                    })
                }
            }
        )

        conn.release()
    })
})

router.delete('/:id_produto', (req, res, next) => {
    const idProduto = req.params.id_produto

    if (!idProduto) {
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
        
        conn.query("DELETE FROM `produtos` WHERE `id` = ?", [idProduto], (qErr, result) => {
            if (qErr) {
                res.status(404).json({
                    error: {message: qErr.sqlMessage}
                })
            }
            else if (!result.changedRows) {
                res.status(404).json({
                    error: {message: "Produto não encontrado"}
                })
            }
            else {
                res.status(410).json({
                    message: 'Produto deletado com sucesso'
                })
            }
        })

        conn.release()
    })
})

module.exports = router