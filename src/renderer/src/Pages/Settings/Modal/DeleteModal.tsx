import { Button } from "@suid/material"
import * as solid from "solid-js";

import style from "./Modal.module.scss";


const DeleteModal: solid.Component<{ hide: Function }> = (props) => {

    const [confirmInput, setConfirmInput] = solid.createSignal("");

    return (
        <div class={style.modal} onClick={() => props.hide()}>
            <div class={style.inner} onClick={e => e.stopPropagation()}>
                <h2>Are you sure you want to delete settings?</h2>
                <p>This operation forcibly clears your saved data. This might break this application, and this application will not work correctly.</p>
                <p>This operation can not be <span style={{ color: "red" }}>undone</span>.</p>
                <p>Type " <code>sudo delete config --all</code> " below to confirm.</p>
                <input class={style.codeInput} type="text" placeholder="plase type confirmation command here" onInput={e => setConfirmInput(e.target.value)} />
                <Button color="error" variant="contained" disabled={confirmInput() != "sudo delete config --all"} onClick={() => localStorage.clear()}>
                    I understand what I'm going to do and confirm Deleting
                </Button>
                <Button color="info" variant="outlined" onClick={() => props.hide()}>
                    Cancel deleting
                </Button>
            </div>
        </div>
    )
}

export default DeleteModal;
