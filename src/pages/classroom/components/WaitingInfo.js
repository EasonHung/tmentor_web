
function WaitingInfo(props) {
    const waitingInfo = props.waitingInfo

    const cancelWaiting = () => {
        props.setWaitingInfo(null)
    }

    return (
        <div style={ {display: 'flex', flexDirection: 'column'} }>
            <p>等待{waitingInfo.teacherNickname}回應中</p>
            <button onClick={cancelWaiting}>取消</button>
        </div>
    )
}

export default WaitingInfo