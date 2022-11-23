import React, {FC} from 'react';
import {IPaginationProps} from "../interfaces";

const Pagination: FC<IPaginationProps> = props => {
    const {currentPage, pagesArray, onPageClick, onDirClick} = props;
    return (
        <div className="pagination">
            <div className='pagination__item' onClick={() => onDirClick(currentPage, 'backwards')}>&laquo;</div>

            {
                pagesArray.map(el => {
                    return (
                        <div key={el} onClick={() => onPageClick(el)}
                             className={el - 1 === currentPage ? 'pagination__item current' : 'pagination__item'}>{el}</div>
                    )
                })
            }

            <div className='pagination__item' onClick={() => onDirClick(currentPage)}>&raquo;</div>
        </div>

    );
};

export default Pagination;
