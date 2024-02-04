import PageRouter from '@renderer/Global/Router/PageRouter';
import { type Component } from 'solid-js';

import "../Global/Styles/Style.scss";

import { MemoryRouter, Router } from '@solidjs/router';
import initStorage from '@renderer/Global/Utils/Storage/initStorage';

const App: Component = () => {
    initStorage();

    return (
        <div class="app">
            <MemoryRouter>
                <PageRouter />
            </MemoryRouter>
        </div>
    )
}

export default App;
