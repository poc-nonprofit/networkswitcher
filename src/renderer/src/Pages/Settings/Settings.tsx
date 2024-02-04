import { AppBar, Button, ButtonBase, Switch, TextField } from "@suid/material"
import * as solid from "solid-js";
import { BsChevronLeft } from "solid-icons/bs";

import style from "./Settings.module.scss";
import { VsSave } from "solid-icons/vs";
import { useNavigate } from "@solidjs/router";
import DeleteModal from "./Modal/DeleteModal";


const Settings: solid.Component = () => {

    const navigate = useNavigate();

    const [deleteModal, setDeleteModal] = solid.createSignal(false);
    const [saveModal, setSaveModal] = solid.createSignal(false);

    let config = JSON.parse(localStorage.getItem("config") || "{}");

    solid.onMount(() => {
        window.electron.ipcRenderer.send("resize", "large");
        window.electron.ipcRenderer.send("position", "center");
    })

    function updatePassword(slot: number, newValue: string) {
        if (!newValue || newValue.length == 0) {
            config[`slot${slot}`].password = [];
        } else {
            const encrypted = window.electron.ipcRenderer.sendSync("encrypt", newValue);
            config[`slot${slot}`].password = Array.from(encrypted);
        }
    }

    function save() {
        localStorage.setItem("config", JSON.stringify(config));
    }

    function navigateBack() {
        window.electron.ipcRenderer.send("resize");
        navigate("/");
    }

    return (
        <div>
            <div class={style.main}>
                <AppBar position="static" class={style.title}>
                    <ButtonBase class={style.icon} onClick={navigateBack}>
                        <BsChevronLeft />
                    </ButtonBase>
                    <h2>Settings - Network Switcher</h2>
                    <ButtonBase class={style.icon} onClick={save} >
                        <VsSave />
                    </ButtonBase>
                </AppBar>
                <div class={style.content}>
                    <h2>Registered Networks</h2>
                    <p>
                        For security purposes, the exact digits are not displayed.
                        Passwords are securely stored.
                    </p>
                    <div class={style.card}>
                        <h3>Slot 1</h3>
                        <div class={style.field}>
                            <b>SSID</b>
                            <TextField class={style.textInput} variant="outlined" label="SSID" defaultValue={config.slot1.SSID} onChange={(e, newValue) => { config.slot1.SSID = newValue }} />
                        </div>
                        <div class={style.field}>
                            <b>Password</b>
                            <TextField class={style.textInput} variant="outlined" type="password" label="Password(If there's no password, leave this empty.)" defaultValue={1234567890} onChange={(e, newValue) => { updatePassword(1, newValue) }} />
                        </div>
                    </div>
                    <div class={style.card}>
                        <h3>Slot 2</h3>
                        <div class={style.field}>
                            <b>SSID</b>
                            <TextField class={style.textInput} variant="outlined" label="SSID" defaultValue={config.slot2.SSID} onChange={(e, newValue) => { config.slot2.SSID = newValue }} />
                        </div>
                        <div class={style.field}>
                            <b>Password</b>
                            <TextField class={style.textInput} variant="outlined" type="password" label="Password(If there's no password, leave this empty.)" defaultValue={1234567890} onChange={(e, newValue) => { updatePassword(2, newValue) }} />
                        </div>
                    </div>
                    <hr />
                    <h2>Auto-startup</h2>
                    <div>
                        Start application at computer startup
                        <Switch defaultChecked={window.electron.ipcRenderer.sendSync("checkAutolaunch")} onChange={(ev, newValue) => { config.autoStart = newValue }} />
                    </div>
                    <hr />
                    <h2>Save Settings</h2>
                    <div>
                        <Button variant="contained" onClick={save}>Save</Button>
                    </div>
                    <hr />
                    <h2>Quit Application</h2>
                    <div>
                        <Button variant="outlined" color="warning" onClick={() => window.electron.ipcRenderer.send("quit")}>Quit</Button>
                    </div>
                    <hr />
                    <h2 style={{ color: "red" }}>Danger Zone: Delete settings</h2>
                    <div>
                        <Button variant="contained" color="error" onClick={() => setDeleteModal(true)}>DELETE ALL SETTINGS</Button>
                    </div>
                    <hr />
                    <h2>Information</h2>
                    <b>Network Switcher</b> <br />
                    By Makisaka. <br />
                    Copyright 2024 Makisaka and POC all rights reserved. This software is open source software that can be freely modified and redistributed under the MIT License.

                </div>
            </div>
            <solid.Show when={deleteModal()}>
                <DeleteModal hide={() => setDeleteModal(false)} />
            </solid.Show>
        </div >
    )
}

export default Settings;
