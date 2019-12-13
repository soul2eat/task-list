
const innitState = {
    tasks: [],
    total_task_count: 0,
    page: 1,
    sort: {
        sort_field : 'username',
        sort_direction : 'asc'
    }
}

export default function (state = innitState, action){
    switch(action.type){
        case 'GET_TASKS':
            return {
                ...state,
                tasks: action.tasks,
                total_task_count: action.total_task_count
            }

        case 'SORT_TABLE':
            return {
                ...state,
                sort:{
                    sort_field: action.sort_field,
                    sort_direction: action.sort_direction
                }
            }
        
        case 'SET_TABLE_PAGE':
            return {
                ...state,
                page: action.page
            }

        default:
            return {...state}
    }
}