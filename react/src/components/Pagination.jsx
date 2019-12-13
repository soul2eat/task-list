import React, { PureComponent } from 'react';

export default class Pagination extends PureComponent{
    back(){
        const { page, setPage, getTasks } = this.props;
        if(page - 1 > 0){
            setPage(page-1);
        }
        getTasks();
    }
    next(){
        const { total_task_count, page, setPage, getTasks } = this.props;
        if(page + 1 <= Math.ceil(total_task_count/3)){
            setPage(page+1);
        }
        getTasks();
    }
    numPage(){
        const { total_task_count, page, setPage, getTasks } = this.props;
        if(total_task_count === 0)
            return null;
        const arrayPages = [<span onClick={this.back.bind(this)}> {'<'} </span>];
        for(let a = 1; a < Math.ceil(total_task_count/3)+1; a++){
            arrayPages.push(
                <span key={a}
                onClick={ ()=>{ setPage(a);getTasks(); } } className={ a===page?'current-page':'' }>
                    {a}
                </span>
            )
        }
        arrayPages.push(<span onClick={this.next.bind(this)}> > </span>);
        return arrayPages;
    }
    render(){
        return (
            <div className="pagination">
                {this.numPage()}
            </div>
        )
    }
}