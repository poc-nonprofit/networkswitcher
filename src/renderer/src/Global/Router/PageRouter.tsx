import * as solid from "solid-js";
import { Route } from "@solidjs/router";
import Switcher from "@renderer/Pages/Switcher/Switcher";
import Settings from "@renderer/Pages/Settings/Settings";

const PageRouter: solid.Component = () => {
    return (
        <>
            <Route path={"/"} component={Switcher} />
            <Route path={"/settings"} component={Settings} />
        </>
    )
}

export default PageRouter;
