import { connect } from 'react-redux'
import Edit from './Edit-view';

const mapStateToProps = (state) =>{
    const { tasks } = state;
    return {
        tasks
    }
}

const mapDispatchToProps = {
}

export default connect(mapStateToProps, mapDispatchToProps)(Edit);