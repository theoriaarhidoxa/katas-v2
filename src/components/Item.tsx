import React, {useState, useEffect, FC} from 'react';
import {stringData} from "../str/strings";
import {useParams, useNavigate} from 'react-router-dom';
import {useContextEveryWhere} from "../context";
import {IWatched, KataObject} from "../interfaces";



const Item: FC = () => {
    const {fetchViewed} = useContextEveryWhere();
    const [kataData, setKataData] = useState<KataObject>({} as KataObject);
    const {kataId} = useParams();
    const navigate = useNavigate();
    const [recentlyViewed, setRecentlyViewed] = useState<IWatched[]>(fetchViewed());

    const getItemById = async (id: string) => {
        const res = await fetch(`${stringData.KATA_BY_ID}/${id}`);
        const data = await res.json();
        setKataData(data);
        if (!recentlyViewed.find(el => el.id === data.id)) {
            setRecentlyViewed([...recentlyViewed, {id: data.id, title: data.name}]);
        }
    };

    useEffect(() => {
        if (kataId) {
            getItemById(kataId).then();
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('recentlyViewed', JSON.stringify(recentlyViewed));
    }, [recentlyViewed]);

    return (

        <div className='wrapper__singleKata'>
            {kataData &&
                <>
                    <button className='btn' onClick={() => navigate('/', {replace: true})}>Назад к списку</button>
                    <h2>{kataData.name}</h2>
                    <b>{kataData.createdAt?.toString().split('T')[0].replace(/-/g, '.')}</b>
                    <p><b>Tags</b>: {kataData.tags?.join(', ')}</p>
                    <div>
                        {<div dangerouslySetInnerHTML={{__html: kataData.description?.replace(/\n/g, '<br>')}} />}
                    </div>

                </>
                }
        </div>
    );
};

export default Item;
