import './App.scss';
import React, {useState, useEffect, useRef, FC} from "react";
import Pagination from "./Pagination";
import {Element, scroller} from 'react-scroll'; // https://www.npmjs.com/package/react-scroll https://www.pluralsight.com/guides/scrolling-inside-a-div-in-react
import {stringData} from "../str/strings";
import {Link} from 'react-router-dom';
import Loader from "./Loader";
import Alert from "./Alert";
import {useContextEveryWhere} from "../context";
import {IWatched} from "../interfaces";

const List: FC = () => {
    const {page, totalPages, paginator, pageNavHelper, arrowNavHelper, fetchPagesAmount, fetchViewed, beenNotified} = useContextEveryWhere();
    const [list, setList] = useState([]);
    const [itemsPerPage, setItemsPerPage] = useState(0);
    const [selectedKataId, setSelectedKataId] = useState<number | null>(null);
    const [userData, setUserData] = useState({
        name: null,
        position: null,
        points: null
    });
    const [kataData, setKataData] = useState({
        author: null,
        rank: null,
        url: null
    });

    const [recentlyViewed, setRecentlyViewed] = useState<IWatched[]>(fetchViewed());
    const [emptyQueue, setEmptyQueue] = useState(false);
    const [viewBlockVisible, setViewedBlockVisible] = useState(JSON.parse(localStorage.getItem('viewBlockVisible') || 'true'));
    const [alertVisible, setAlertVisible] = useState(true);


    useEffect(() => {
        fetchKatas().then();
    }, [page]);

    useEffect(() => {
        fetchUser().then();
    }, []);

    useEffect(() => {
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }, [recentlyViewed]);

    useEffect(() => {
        localStorage.setItem('viewBlockVisible', JSON.stringify(viewBlockVisible));
    }, [viewBlockVisible]);

    const listElement = useRef<HTMLDivElement>(null);

    const fetchKatas = async () => {
        const res = await fetch(`${stringData.ALL_KATAS}${page}`);
        const katas = await res.json();
        setList(katas.data);
        fetchPagesAmount(katas['totalPages']);
        setItemsPerPage(katas.data.length);
    };

    const fetchUser = async () => {
        const res = await fetch(`${stringData.ALL_KATAS.split('code-')[0]}`);
        const cat = await res.json();
        setUserData({
            name: cat['username'],
            position: cat['leaderboardPosition'],
            points: cat['honor'],
        });
    };

    const fetchById = async (id: number) => {
        const res = await fetch(`${stringData.KATA_BY_ID}${id}`);
        const kata = await res.json();
        setKataData({
            author: kata['createdBy'].username,
            rank: kata['rank'].name,
            url: kata['url']
        });
    };

    const pageNav = (num: number) => {
        pageNavHelper(num);
        topScroller();
        setSelectedKataId(null);
    };

    const arrowNav = (page: number, direction?: string) => {
        arrowNavHelper(page, direction, totalPages);
        topScroller();
        setSelectedKataId(null);
    };

    const topScroller = () => {
        scroller.scrollTo('scrollTopPosition', {
            duration: 1500,
            delay: 100,
            smooth: true,
            containerId: 'myScrollToElement',
            offset: -50, // Scrolls to element + 50 pixels down the page
        })
    };

    const infoHandler = (e: React.MouseEvent<HTMLElement, MouseEvent>, kataId: number): void => {
        setSelectedKataId(selectedKataId ? null : kataId);
        const classes = (e.target as HTMLElement).classList;
        classes.toggle('clicked');
        fetchById(kataId).then();
    };

    const clearViewedHistory = () => {
        setEmptyQueue(() => true);
        setTimeout(() => {
            setRecentlyViewed([]);
        }, 1500);
    };

    const clearViewedItem = (id: number) => {
        if (recentlyViewed.length < 2) {
            clearViewedHistory();
        } else {
            setRecentlyViewed(recentlyViewed.filter(el => el.id !== id));
        }
    };

    const manageViewedVisibility = () => {
        setViewedBlockVisible(!viewBlockVisible);
    };

    const handleAlertClosing = () => {
        clearViewedHistory();
    };

    const handleAlertCancelling = () => {
        setAlertVisible(false);
        beenNotified();
    };

    // todo реализовать функционал mySelect, если будет подходяший API (как на JSON PlaceHolder)

    return (
        <>
            <Pagination currentPage={page} pagesArray={paginator} onPageClick={pageNav} onDirClick={arrowNav}/>

            <p>Расширенный список задач CodeWars.<br/> Вместо ссылок на карточки задач - открытие на внутренней странице.<br/>
                Просмотренные элементы добавляются в стек, который по достижении определённого количества
                переполняется, о чём и сообщает.<br/>
                При возвращении к списку сохраняется текущая позиция в пагинаторе.</p>

            <table className='userData'>
                <tbody>
                <tr>
                    <th>username</th>
                    <td>{userData.name}</td>
                </tr>
                <tr>
                    <th>position</th>
                    <td>{userData.position}</td>
                </tr>
                <tr>
                    <th>points</th>
                    <td>{userData.points}</td>
                </tr>
                </tbody>
            </table>

            <div id='myScrollToElement' className="listWrapper" ref={listElement}>
                <Element name="scrollTopPosition"/>
                {!list.length && <Loader/>}
                {list.map(el => {
                    const {id, name} = el;
                    return (
                        <div key={id}
                             className={selectedKataId && selectedKataId !== id ? 'listWrapper__item inactive' : 'listWrapper__item'}>
                            <Link to={`/kata/${id}`}>{name}</Link>
                            <small
                                onClick={e => infoHandler(e, id)}>{id === selectedKataId ? 'Скрыть' : 'Подробнее'}</small>
                            <div className='listWrapper__item-info'>
                                <ul className={!kataData ? 'blurred' : ''}>
                                    <li><b>author:</b> {kataData.author}</li>
                                    <li><b>rank:</b> {kataData.rank}</li>
                                    <li><b>url:</b> <a rel='noreferrer' href={kataData.url || ''} target='_blank'>{kataData.url}</a></li>
                                </ul>
                            </div>
                        </div>
                    )
                })}
            </div>
            <small>Элементов на странице: <b>{itemsPerPage}</b>.</small>
            <span className='scrollTop' onClick={topScroller}>scroll</span>

            {!!recentlyViewed.length && viewBlockVisible && <div className={emptyQueue ? 'cloud animated' : 'cloud'}>
                <p className='cloud__title'>Просмотренные ката ({recentlyViewed.length}):</p>
                <ul className='cloud__list'>
                    {recentlyViewed.map(el => {
                        const {id, title} = el;
                        return (
                            <li key={id} className='cloud__list-item'><a rel='noreferrer' href={`https://www.codewars.com/kata/${id}`}
                                                                         target='_blank'>{title}</a><span
                                onClick={() => clearViewedItem(id)}>Удалить &times;</span></li>
                        )
                    })}
                </ul>
                <span className='cloud__clear btn' onClick={clearViewedHistory}>Очистить историю просмотров</span>
            </div>}

            {recentlyViewed.length > 9 && viewBlockVisible && alertVisible &&
            <Alert onCancel={handleAlertCancelling} onSubmit={handleAlertClosing}/>}
            <div className={viewBlockVisible ? 'toggleViewedBlock active' : 'toggleViewedBlock'}
                 onClick={manageViewedVisibility}>
                <span><i/></span> <p>Показывать историю просмотров</p>
            </div>
        </>
    );
}

export default List;
