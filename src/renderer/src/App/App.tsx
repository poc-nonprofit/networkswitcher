import PageRouter from '@renderer/Global/Router/PageRouter';
import { onMount, type Component } from 'solid-js';

import "../Global/Styles/Style.scss";

import style from "./App.module.scss";
import { Router } from '@solidjs/router';
import initStorage from '@renderer/Global/Utils/Storage/initStorage';

const App: Component = () => {

    onMount(() => {
        initStorage();
    })

    return (
        <div class="app">
            <Router>
                <PageRouter />
            </Router>
        </div>
    )
}

export default App;
