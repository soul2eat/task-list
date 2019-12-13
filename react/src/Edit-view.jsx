import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { sendWithPromise } from './request'
import { getCookie, setCookie } from './cookies'

export default class Create extends Component {
    constructor(props) {
        super(props);
        this.text = React.createRef();
        this.edit = this.edit.bind(this);
    }

    async edit() {
        const token = getCookie('token');
        const { id } = this.props.match.params;
        const result = await sendWithPromise({
            path: '/edit/' + id,
            objData: {
                text: this.text.current.value,
                token
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
            if (message.token) {
                setCookie('token', '', { 'max-age': -1 });
            }
            return;
        }
        this.props.history.push('/');
        console.log(message);

    }

    componentDidMount() {
        const { id } = this.props.match.params;
        const { tasks } = this.props;
        const [task] = tasks.filter(task => {
            return task.id === id*1 
        });
        if (task)
            this.text.current.value = task.text;
    }

    render() {
        const { id } = this.props.match.params;

        console.log(id);

        return (
            <div>
                <div className="header link"><Link to="/">Главная</Link></div>
                <div className="modal">
                    <div className="modal-centered">
                        <div className="modal-container">
                            <input type="text" className="modal-input" placeholder="Текст" ref={this.text} />
                            <div className="modal-button"><input type="button" value="Редактировать" onClick={this.edit} /></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}