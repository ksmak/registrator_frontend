import { useMemo } from 'react';

export const usePagination = (pageCount) => {
    const pages = useMemo(() => {
        let arr = []
        for (let i = 1; i <= pageCount; i++) {
            arr.push(i);
        }
        return arr;
    }, [pageCount]);
    
    return pages;
};