import '../css/Classroom.css'
import ClassroomItem from './ClassroomItem'
import BorderLine from './BorderLine'

function ClassroomList(props) {
    const classroomList =  props.classroomList === undefined? [] : props.classroomList

    return (
        <div>
            {classroomList.map( (item, index) => {
                return (
                    <div key={item.classroomId}>
                        <ClassroomItem 
                            classroom={item} 
                            setOpenModal={props.setOpenModal} 
                            setModalContant={props.setModalContant}
                            classroomWs={props.classroomWs}
                            setWaitingInfo={props.setWaitingInfo}/>
                        <BorderLine/>
                    </div>
                )
            })}
        </div>
    )
}

export default ClassroomList