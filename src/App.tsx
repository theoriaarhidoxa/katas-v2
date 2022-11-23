import './components/App.scss';
import React, {FC} from "react";
import {HashRouter, Routes, Route} from 'react-router-dom';
import List from "./components/List";
import Item from "./components/Item";


const App: FC = () => {
    return (
        <div className='wrapper'>
            <HashRouter>
                <Routes>
                    <Route path='/' element={<List />}/>
                    <Route path='/kata/:kataId' element={<Item />}/>
                </Routes>
            </HashRouter>
        </div>
    );
}

export default App;

/* router implementations:
https://www.freecodecamp.org/news/deploy-a-react-app-to-github-pages/
https://create-react-app.dev/docs/deployment/#github-pages-https-pagesgithubcom
*/
