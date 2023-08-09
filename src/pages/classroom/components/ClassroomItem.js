import { alertToast } from '../../../service/toast_service'
import '../css/Classroom.css'
import { showEnterConfirmModal } from '../service/classroom_access_service'

function ClassroomItem(props) {
    const classroom = props.classroom
    const setOpenModal = props.setOpenModal
    const setModalContant = props.setModalContant
    const setWaitingInfo = props.setWaitingInfo
    const classroomWs = props.classroomWs

    const accessClassroom = () => {
        if(classroom.status === "offline") {
            alertToast("老師尚未上線")
            return
        }

        showEnterConfirmModal(classroomWs, classroom, setModalContant, setOpenModal, setWaitingInfo)
    }

    return (
        <div className='ClassroomItem' onClick={accessClassroom}>
            <div style={ {display: 'flex'} }>
                <div className='ClassroomAvatar'>
                    <img src={classroom.teacherAvatar} alt="Avatar" className="avatar"/>
                </div>
                <div>
                    <div className='ClassroomUsername'>name: {classroom.teacherNickname}</div>
                    <div className='ClassroomUserProf'>profession: {classroom.teacherProfession[0]}</div>
                    <div className='ClassroomStatus'>status: {classroom.status}</div>
                </div>
            </div>
            <div className='ClassroomDesc'>
                description: {classroom.classDesc}
            </div>
            <div style={ {display: 'flex'} }>
                <div className='ClassroomTimePoints'>
                    time: {classroom.classTime}
                </div>
            </div>
        </div>
    )
}

export default ClassroomItem