
function ClassroomVideo(props) {
    let bigVideoStream
    let miniVideoStream

    const bigVideoSelect = document.querySelector('#bigVideo')
    const miniVideoSelect = document.querySelector('#miniVideo')

    if(props.openSelfClassroom && props.localStream.id !== undefined) {
        miniVideoSelect.srcObject = props.localStream
        miniVideoStream = props.localStream
    }

    if(props.openSelfClassroom && props.remoteStream.id !== undefined) {
        bigVideoSelect.srcObject = props.remoteStream
        bigVideoStream = props.remoteStream
    }

    

    const closeClassroom = () => {
        if(bigVideoStream) {
            bigVideoStream.getTracks().forEach(function(track) {
                if (track.readyState === 'live') {
                    track.stop();
                }
            });
        }

        if(miniVideoStream) {
            miniVideoStream.getTracks().forEach(function(track) {
                if (track.readyState === 'live') {
                    track.stop();
                }
            });
        }

        props.closeClassroomCallBack()
    }

    const leaveClassroom = () => {
        if(bigVideoStream) {
            bigVideoStream.getTracks().forEach(function(track) {
                if (track.readyState === 'live') {
                    track.stop();
                }
            });
        }

        if(miniVideoStream) {
            miniVideoStream.getTracks().forEach(function(track) {
                if (track.readyState === 'live') {
                    track.stop();
                }
            });
        }

        props.leaveClassroomCallBack()
    }

    return(
        <div style={ {display: props.isInClassroom && !props.waitingInfo? 'flex' : 'none', flexDirection: 'column'} }>
            <video autoPlay playsInline id="bigVideo"></video>
            { !props.teacherClassroomInfo && <button onClick={closeClassroom}>close classroom</button> }
            { props.teacherClassroomInfo && <button onClick={leaveClassroom}>leave classroom</button> }
            <video autoPlay playsInline id="miniVideo"></video>
        </div>
    )
}

export default ClassroomVideo