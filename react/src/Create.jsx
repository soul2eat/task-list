import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { sendWithPromise } from './request'

export default class Create extends Component {
    constructor(props) {
        super(props);
        this.username = React.createRef();
        this.email = React.createRef();
        this.text = React.createRef();
        this.createTask = this.createTask.bind(this);
    }

    async createTask() {
        const result = await sendWithPromise({
            path: '/create',
            objData: {
                username: this.username.current.value,
                email: this.email.current.value,
                text: this.text.current.value
            }
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
        alert('Задача успешно добавлена');
        this.props.history.push('/');
    }
    render() {

        return (
            <div>
                <div className="header link"><Link to="/">Главная</Link></div>
                <div className="modal">
                    <div className="modal-centered">
                        <div className="modal-container">
                            <input type="text" className="modal-input" placeholder="Имя" ref={this.username} />
                            <input type="text" className="modal-input" placeholder="Emai" ref={this.email} />
                            <input type="text" className="modal-input" placeholder="Текст" ref={this.text} />
                            <div className="modal-button"><input type="button" value="Создать" onClick={this.createTask} /></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}