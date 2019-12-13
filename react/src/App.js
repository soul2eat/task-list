import { connect } from 'react-redux'
import App from './App-view';
import { getTasks, sortTable, setPage } from './store/actionCreators';

const mapStateToProps = (state) => {
    const { tasks, total_task_count, sort, page } = state;
    return {
        tasks,
        total_task_count,
        ...sort,
        page
    }
}

const mapDispatchToProps = {
    getTasks,
    sortTable,
    setPage
}

export default connect(mapStateToProps, mapDispatchToProps)(App);