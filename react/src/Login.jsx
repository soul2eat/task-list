import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { sendWithPromise } from './request'
import { setCookie } from './cookies'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.username = React.createRef();
        this.password = React.createRef();
        this.auth = this.auth.bind(this);
    }
    async auth() {
        const username = this.username.current.value,
            password = this.password.current.value;
        const result = await sendWithPromise({
            path: '/login',
            objData: { username, password }
        });
        const { message } = result;
        if (result.status === 'error') {
            if (result.message.error) {
                console.log(result.message.error);
                return;
            }

            let error = '';
            for (let key in message) {
                error += message[key] + '\n';
            }
            alert(error);
            return;
        }

        const { token } = result.message;
        setCookie('token', token, { 'max-age': 24 * 60 * 60 });
        this.props.history.push('/');
    }
    render() {
        return (
            <div>
                <div className="header link"><Link to="/">Главная</Link></div>
                <div className="modal">
                    <div className="modal-centered">
                        <div className="modal-container">
                            <input ref={this.username} type="text" className="modal-input" placeholder="Логин" />
                            <input ref={this.password} type="text" className="modal-input" placeholder="Пароль" />
                            <div className="modal-button" ><input onClick={this.auth} type="button" value="Войти" /></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}