import { Button } from "@suid/material"
import * as solid from "solid-js";

import style from "./Modal.module.scss";


const SaveModal: solid.Component<{ hide: Function }> = (props) => {
    return (
        <div class={style.modal} onClick={() => props.hide()}>
            <div class={style.inner} onClick={e=>e.stopPropagation()}>
                <h2>Discard changes?</h2>
                <p>You have unsaved changes.</p>
                <Button color="info" variant="outlined" onClick={()=>props.hide()}>
                    Save
                </Button>
                <Button color="warning" variant="outlined" onClick={() => props.hide()}>
                    Don't save
                </Button>
                <Button color="inherit" variant="outlined" onClick={() => props.hide()}>
                    Continue configuring
                </Button>
            </div>
        </div>
    )
}

export default SaveModal;
