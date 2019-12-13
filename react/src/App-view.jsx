import React, { Component } from 'react';
import Table from './components/Table'
import Pagination from './components/Pagination'
import { Link } from 'react-router-dom'
import { getCookie, setCookie } from './cookies'
import { sendWithPromise } from './request'


class App extends Component {
  componentDidMount() {
    this.props.getTasks();
  }
  logout() {
    const token = getCookie('token');
    sendWithPromise({
      path: '/logout',
      objData: {
        token
      }
    });
    setCookie('token', '', { 'max-age': -1 });
    window.location.reload();
  }
  render() {
    const { getTasks, total_task_count, page, setPage } = this.props;
    const token = getCookie('token');
    return (<div>
      <div className="header">
        <Link to="/create"><span className="link">Создать</span></Link>
        {
          !token
            ? <Link to="/login"><span className="link">Вход</span></Link>
            : <span onClick={this.logout} className="link">Выход</span>
        }
      </div>
      <Table {...this.props} token={token} />
      <Pagination page={page} setPage={setPage} getTasks={getTasks} total_task_count={total_task_count} />
    </div>)
  }
}
export default App;
