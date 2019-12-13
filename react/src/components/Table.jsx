import React, { PureComponent } from 'react';
import { Link } from 'react-router-dom'
import { getCookie, setCookie } from '../cookies'
import { sendWithPromise } from '../request'
import './Table.css';

const SORT_ICON = { asc: '↓ ', desc: '↑ ' };
export default class Table extends PureComponent {
    constructor(props) {
        super(props);
        this.sortTable = this.sortTable.bind(this);
    }
    sortField(current) {
        const { sort_field, sort_direction } = this.props;
        if (sort_field === current)
            return SORT_ICON[sort_direction];
        return <span className="hidden"></span>;
    }
    // sort_field : 'id',sort_direction : 'asc'

    sortTable(current) {
        const { sortTable, getTasks, sort_field, sort_direction } = this.props;
        if (sort_field === current) {
            const direction = sort_direction === 'asc' ? 'desc' : 'asc';
            sortTable(sort_field, direction);
            getTasks();
            return;
        }
        sortTable(current, 'asc');
        getTasks();
    }

    generateTable() {
        const { tasks, token } = this.props;
        if(!tasks.length){
            return (
                <tr>
                    <td colspan="5" className="default-table">Еще нету созданых задач</td>
                </tr>
            )
        }
        return tasks.map(({ id, username, email, text, status, edited }) => {
            let statusCell = status === 10 ? 'Выполнено.' : 'Не выполнено.';
            if (edited)
                statusCell += ' Отредактировано администратором.';
            return (
                <tr key={id}>
                    {token
                        ?(<td className="option">
                            <img onClick={()=>this.complateTask(id)} src="/img/complate.png" className="icons" title="Выполнено" alt="Выполнено" />
                            <Link to={ '/edit/' + id }><img src="/img/edit.png" className="icons" title="Редактировать" alt="Редактировать" /></Link>
                        </td>)
                        :null}
                    <td>{username}</td>
                    <td>{email}</td>
                    <td>{text}</td>
                    <td className="status-cell">{statusCell}</td></tr>
            )
        })
    }

    async complateTask(id){
        const token = getCookie('token');
        const result = await sendWithPromise({
            path: '/edit/' + id, 
            objData: {
                status: 10,
                token
                }
        });
        const { message } = result;
        if(result.status === 'error'){
            if(result.message.error){
                console.log(result.message.error);
                return;
            }

            let error = '';
            for(let key in message){
                error += message[key] + '\n';
            }
            alert(error);
            if(message.token){
                setCookie('token', '', {'max-age': -1});
            }
            return;
        }
        this.props.history.push('/');
        console.log(message);
        
    }

    render() {
        const { token } = this.props;
        return (
            <table>
                <thead>
                    <tr>
                        {token?<th className="option"></th>:null}
                        <th onClick={() => { this.sortTable('username') }} >
                            {this.sortField('username')} Имя пользователя
                        </th>
                        <th onClick={() => { this.sortTable('email') }}>
                            {this.sortField('email')} Email
                        </th>
                        <th>Текст задачи</th>
                        <th onClick={() => { this.sortTable('status') }} >
                            {this.sortField('status')} Статус
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {this.generateTable()}
                </tbody>
            </table>
        )
    }
}
