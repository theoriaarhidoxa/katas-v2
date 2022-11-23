import React, {useState, useContext, PropsWithChildren} from 'react';
import {stringData} from "./str/strings";
import {AppContextInterface} from "./interfaces";

const AppContext = React.createContext<AppContextInterface>({
    page: 1,
    totalPages: 0,
    paginator: [],
    pageNavHelper: () => {},
    arrowNavHelper: () => {},
    fetchPagesAmount: () => {},
    fetchViewed: () => {return []},
    notify: false,
    beenNotified: () => {},
    notNotified: () => {}
});

const AppProvider = (props: PropsWithChildren<React.ReactNode>) => {
    const {children} = props;
    const [page, setPage] = useState(0);
    const [paginator, setPaginator] = useState<number[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [notify, setNotify] = useState(false);

    const pageNavHelper = (num: number) => {
        setPage(num - 1);
    };

    const arrowNavHelper = (num: number, dir?: string) => {
        const lt = dir === stringData.BACKWARDS;
        switch (num) {
            case 0:
                setPage(lt ? totalPages - 1 : page + 1);
                break;
            case totalPages - 1:
                setPage(lt ? page - 1 : 0);
                break;
            default:
                setPage(lt ? page - 1 : page + 1);
                break;
        }
    };

    const fetchPagesAmount = (value: number) => {
        setTotalPages(value);
        const pages = [];
        for (let i = 1; i <= value; i++) {
            pages.push(i);
        }
        setPaginator(pages);
    };

    const fetchViewed = () => {
        return JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    };

    const beenNotified = () => {
        setNotify(true);
    };

    const notNotified = () => {
        setNotify(false);
    };

    return <AppContext.Provider value={
        {page, totalPages, paginator, pageNavHelper, arrowNavHelper, fetchPagesAmount,
        fetchViewed, notify, beenNotified, notNotified}}>{children}</AppContext.Provider>
};

export const useContextEveryWhere = () => {
  return useContext(AppContext);
};

export {AppContext, AppProvider};
