const mysql = require('mysql2/promise');
const express = require('express')
const validator = require('validator');
const multer = require('multer');
var crypto = require('crypto');

const app = express()
const router = express.Router();
const upload = multer();

const SORT_BY = ['id', 'username', 'email', 'status'];
const SECRET_KEY = 'QsSt2';
const config = require('./config');
// connect to database
let connection = null;
connectDB();

router.get('/', async function (req, res) {
    try {
        const { sort_field, sort_direction, page } = req.query;
        let parsePage = parseInt(page);
        let queryParams = '';
        // ORDER BY
        if (~SORT_BY.indexOf(sort_field)) {
            queryParams += ' ORDER BY ' + sort_field;
            if(sort_field === 'status'){
                queryParams += ', edited';
            }
        } else {
            queryParams += ' ORDER BY id';

        }
        // ASC DESC
        if (sort_direction !== 'asc' && sort_direction !== 'desc') {
            queryParams += ' ASC';
        } else {
            queryParams += ' ' + sort_direction;
        }
        // PAGE
        if (isNaN(parsePage) || parsePage < 1) {
            queryParams += ' LIMIT 0, 3';
        } else {
            queryParams += ' LIMIT ' + (3 * (parsePage - 1)) + ', 3';
        }

        const [tasks] = await connection.query('SELECT * FROM tasks ' + queryParams);
        const total_task_count = (await connection.query('SELECT COUNT(*) as count FROM tasks'))[0][0].count;
        res.json({
            status: 'ok',
            message: {
                tasks,
                total_task_count
            }
        });
        return;

    } catch (error) {
        console.log(error.message);
        res.json({
            status: 'error',
            message: 'Unknown error!'
        })
        return;
    }

})

router.post('/create', async function (req, res) {
    try {
        const { username, email, text } = req.body;
        let message = {}, status = 'ok';
        if (validator.isEmpty(username + '')) {
            status = 'error';
            message.username = "Поле имя является обязательным для заполнения";
        }

        if (!validator.isEmail(email + '')) {
            status = 'error';
            message.email = "Неверный email";
        }

        if (validator.isEmpty(text + '')) {
            status = 'error';
            message.text = "Поле текст является обязательным для заполнения";
        }
        if (status === 'error') {
            console.log(message);

            return res.json({ status, message });
        }
        const [result] = await connection.query('INSERT INTO tasks (username, email, text) VALUES (?, ?, ?)', [username, email, text]);

        res.json({
            status,
            message: {
                id: result.insertId,
                status: 0,
                edited: 0,
                username,
                email,
                text
            }
        });
    } catch (error) {
        console.log(error.message);
        res.json({
            status: 'error',
            message: 'Unknown error!'
        });
    }
})

router.post('/login', async function (req, res) {
    const { username, password } = req.body;
    let message = {}, status = 'ok';
    if (validator.isEmpty(username + '')) {
        status = 'error';
        message.username = "Поле имя является обязательным для заполнения";
    }
    if (validator.isEmpty(password + '')) {
        status = 'error';
        message.password = "Поле пароль является обязательным для заполнения";
    }
    if (status === 'error') {
        return res.json({ status, message });
    }
    const passHash = crypto.createHash('sha256').update(password).digest('hex');
    const [user] = await connection.query('SELECT * FROM users WHERE password=? and username=?', [passHash, username]);
    if (!user.length) {
        return res.json({
            status: 'error',
            message: {
                password: 'Неверный логин или пароль'
            }
        })
    }
    const timestamp = Date.now() + 24 * 60 * 60 * 1000;
    const token = crypto.createHmac('sha256', SECRET_KEY).update(timestamp + username).digest('hex');
    const [result] = await connection.query('INSERT INTO sessions (token, user, timestamp) VALUES (?, ?, ?)', [token, user[0].id, timestamp]);
    res.json({
        status: 'ok',
        message: {
            token
        }
    });
})

router.post('/edit/:id', async function (req, res) {
    let { id } = req.params;
    id = parseInt(id);
    const { text, token, status } = req.body;

    if (isNaN(id) || (validator.isEmpty(text + '') && status != 10)) {
        return res.json({
            status: 'error',
            message: {
                empty: 'Некорректно заполнены поля'
            }
        })
    }
    const [checkToken] = await connection.query('SELECT * FROM sessions WHERE token=?', [token]);
    if (!checkToken.length || checkToken[0].timestamp < Date.now()) {
        return res.json({
            status: 'error',
            message: {
                "token": "Токен истёк"
            }
        })
    }
    const [tasks] = await connection.query('SELECT * FROM tasks WHERE id=?', id);
    if (!tasks.length) {
        return res.json({
            status: 'error',
            message: {
                id: 'Неккоректный id'
            }
        })
    }
    if (text && tasks[0].text !== text) {
        await connection.query('UPDATE tasks SET text=?, edited=1 WHERE id=?', [text, id]);
    }
    if (status == 10) {
        await connection.query('UPDATE tasks SET status=10 WHERE id=?', [id]);
    }
    res.json({
        "status": "ok"
    });

})

router.post('/logout', async function (req, res) {
    const { token } = req.body;
    if (typeof token === 'string') {
        await connection.query('DELETE FROM sessions WHERE token=?', token);
        return res.json({
            status: 'ok'
        });
    }
    res.json({
        status: 'error',
        message: {
            token: "Токен истёк"
        }
    })
})

app.use('/~shapoval/test-task-backend/v2', handlerMiddleware, upload.none(), router);


app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}!`);
})

async function connectDB() {
    try {
        connection = await mysql.createConnection({ host: 'localhost', ...config.db })
    } catch (error) {
        console.log('Ошибка соединения с базой данных\n', error.message);
        setTimeout(connectDB, 10000);
        return;
    }
    console.log('Подключен к бд');
}

function handlerMiddleware(req, res, next) {
    if (!req.query.developer) {
        return res.json({
            "status": "error",
            "message": "Не передано имя разработчика"
        });
    }
    next();
}