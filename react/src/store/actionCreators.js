import { GET_TASKS, SORT_TABLE, SET_TABLE_PAGE } from "./actions";
import { sendWithPromise } from "../request";

export function getTasks() {
    return async (dispatch, getState) => {
        const state = getState();
        const result = await sendWithPromise({
            query: {
                ...state.sort,
                page: state.page
            }
        });
        if(result.status === 'error'){
            console.log(result.message.error);
            return;
        }
        const { tasks, total_task_count} = result.message;
        dispatch({
            type: GET_TASKS,
            tasks,
            total_task_count
        });
    };
}


export function sortTable(sort_field, sort_direction){
    return {
        type: SORT_TABLE,
        sort_field,
        sort_direction
    }
}

export function setPage(page){
    return {
        type: SET_TABLE_PAGE,
        page
    }
}
