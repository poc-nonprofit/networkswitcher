import * as solid from "solid-js";
import clsx from "clsx";
import { VsChromeClose } from 'solid-icons/vs'
import { BsGear, BsPinAngle, BsPinFill } from 'solid-icons/bs';

import style from "./Switcher.module.scss";
import { useNavigate } from "@solidjs/router";

const Switcher: solid.Component = () => {

    const [connection, setConnection] = solid.createSignal<number>(0);

    const [netName, setNetName] = solid.createSignal(["Network 1", "Network 2"])

    const [pinned, setPinned] = solid.createSignal(false);

    const navigate = useNavigate();

    let config;

    solid.onMount(() => {
        /* const net1 = JSON.parse(localStorage.getItem("slot1") || '{name:"Network"}').name;
        const net2 = JSON.parse(localStorage.getItem("slot2") || '{name:"Network"}').name;
        setNetName([net1, net2]); */
        window.electron.ipcRenderer.send("initSwitcherWindow");
        window.electron.ipcRenderer.send("resize", "small");
        window.electron.ipcRenderer.on("currentConnection", (e, args) => {
            setConnection(netName().indexOf(args));
        });
        config = JSON.parse(localStorage.getItem("config") || "{}");
        setPinned(config.screen.AOT);
        setNetName([config.slot1.SSID, config.slot2.SSID]);
        window.electron.ipcRenderer.send("pin", config.screen.AOT);
        window.electron.ipcRenderer.send("position", [config.screen.x, config.screen.y])
    });

    function connect(index) {
        window.electron.ipcRenderer.send("connect", JSON.stringify(JSON.parse(localStorage.getItem(`config`) || "{}")[`slot${index + 1}`]))
    }

    function toggleAOT() {
        window.electron.ipcRenderer.send("pin", !pinned());
        config.screen.AOT = !pinned();
        setPinned(p => !p);
    }

    function hideWindow() {
        window.electron.ipcRenderer.send("hide");
    }

    function navigateSettings() {

        const config = JSON.parse(localStorage.getItem("config") || "{}");

        const [x, y] = window.electron.ipcRenderer.sendSync("getPosition");

        config.screen.x = x;
        config.screen.y = y;

        localStorage.setItem("config", JSON.stringify(config));

        navigate("/settings");
    }

    return (
        <div>
            <div class={style.main}>
                <div class={style.title}>
                    <h3>Network Switcher</h3>
                    <button class={style.icon} onClick={navigateSettings}><BsGear /></button>
                    <button class={style.icon} onClick={toggleAOT}>
                        <solid.Show when={pinned()} fallback={<BsPinAngle />}>
                            <BsPinFill />
                        </solid.Show>
                    </button>
                    <button class={clsx(style.icon, style.x)} onClick={hideWindow}><VsChromeClose /></button>
                </div>
                <div class={style.container}>
                    <button class={style.card} data-active={connection() == 0} onClick={() => connect(0)}>
                        <h2>{netName()[0]}</h2>
                    </button>
                    <button class={style.card} data-active={connection() == 1} onClick={() => connect(1)}>
                        <h2>{netName()[1]}</h2>
                    </button>
                </div>
            </div>
        </div >
    )
}

export default Switcher;
