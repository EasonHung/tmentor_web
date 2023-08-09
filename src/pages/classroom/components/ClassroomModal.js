import React from "react";
import "../css/ClassroomModal.css";

function ClassroomModal(props) {
    const modalContant = props.modalContant
    const setOpenModal = props.setOpenModal

    return (
        <div className="modalBackground">
            <div className="modalContainer">
                <div className="titleCloseBtn">
                <button
                    onClick={() => {
                    setOpenModal(false);
                    }}
                >
                    X
                </button>
                </div>
                <div className="title">
                <h1>{modalContant.title}</h1>
                </div>
                <div className="body">
                <p>{modalContant.body}</p>
                </div>
                <div className="footer">
                <button
                    onClick={() => {
                    modalContant.cancelFunction();
                    setOpenModal(false);
                    }}
                    id="cancelBtn"
                >
                    Cancel
                </button>
                <button onClick={() => {
                    modalContant.confirmFunction();
                    setOpenModal(false);
                    }} >Continue</button>
                </div>
            </div>
        </div>
    );
}

export default ClassroomModal;