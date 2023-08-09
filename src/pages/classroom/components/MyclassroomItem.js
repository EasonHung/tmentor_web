import '../css/Classroom.css'

function MyclassroomItem(props) {
    const userInfo = props.userInfo === undefined? {} : props.userInfo
    const selfClassroomInfo = props.selfClassroomInfo
    const desc = selfClassroomInfo.classSettingInfo? selfClassroomInfo.classSettingInfo.desc : ""

    return (
        <div className='MyClassroomItem'>
            <div style={ {display: 'flex'} }>
                <div className='MyClassroomAvatar'>
                    <img src={userInfo.avatorUrl} alt="Avatar" className="avatar"/>
                </div>
                <div>
                    <div className='MyClassroomUsername'>name: {userInfo.nickname}</div>
                    <div className='MyClassroomUserProf'>profession: {userInfo.profession === undefined? "loading..." : userInfo.profession[0]}</div>
                    <div className='MyClassroomStatus'>status: {selfClassroomInfo.status}</div>
                </div>
            </div>
            <div className='MyClassroomDesc'>
                description: {desc}
            </div>
            <div style={ {display: 'flex'} }>
                <div className='MyClassroomTimePoints'>
                    time: / points: start
                </div>
            </div>
        </div>
    )
}

export default MyclassroomItem