require('dotenv').config()

const express = require('express')
const mysql = require('mysql')
const router = express.Router()
const server_url = process.env.SERVER_URL

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
                return
            }

            if (!result.length) {
                res.status(404).json({
                    error: {message: "Não existe produtos no banco de dados"}
                })
                return
            }

            const response = {
                quantidade: result.length,
                produtos: result.map(e => {
                    return {
                        id: e.id,
                        descricao: e.descricao,
                        preco: e.preco,
                        request: {
                            tipo: "GET",
                            descricao: "Retorna todos os produtos",
                            url: `${server_url}/produtos/${e.id}`
                        }
                    }
                })
            }

            res.status(200).json(response)
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
        
        conn.query("SELECT id, descricao, preco FROM `produtos` WHERE `id` = ? LIMIT 1", [idProduto], (qErr, result) => {
            if (qErr) {
                res.status(500).json({
                    error: {message: qErr.sqlMessage}
                })
                return
            } 

            if (!result.length) {
                res.status(404).json({
                    error: {message: "Produto não encontrado"}
                })
                return
            }

            const response = {
                ...result[0],
                request: {
                    tipe: "GET",
                    descricao: "Retornar um produto especifico"
                }
            }

            res.status(200).json(response)
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
                return
            }

            const response = {
                message: "Produto inserido com sucesso",
                createdNow: {
                    id: result.id,
                    descricao,
                    preco,
                    request: {
                        tipo: "POST",
                        descricao: "insere um produto",
                        url: `${server_url}/produtos`
                    }
                }
            }

            res.status(200).json(response)
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
                    return
                }

                if (!result.changedRows) {
                    res.status(404).json({
                        error: {message: "Produto não encontrado"}
                    })
                    return
                }
                    
                const response = {
                    produto: {
                        id: idProduto,
                        descricao: descricao,
                        preco: preco,
                        request: {
                            tipo: "PUT",
                            descricao: "Atualiza todas as informações de um produto",
                            url: `${server_url}/produtos`
                        }
                    }
                }

                res.status(200).json(response)
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
                return
            }
            
            if (!result.changedRows) {
                res.status(404).json({
                    error: {message: "Produto não encontrado"}
                })
                return
            }
            
            res.status(410).json({
                message: 'Produto deletado com sucesso'
            })
        })

        conn.release()
    })
})

module.exports = router