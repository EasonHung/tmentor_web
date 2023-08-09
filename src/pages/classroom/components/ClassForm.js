import { useRef } from 'react'
import '../css/Classroom.css'
import { openClassroom } from '../service/classroom_access_service'
import { buildClassSetting } from '../service/class_setting_service'

function ClassForm(props) {
    const classroomWs = props.classroomWs
    const setOpenSelfClassroom = props.setOpenSelfClassroom
    const classroomNameRef = useRef(null)
    const classroomDescRef = useRef(null)
    const classroomTimeRef = useRef(null)

    const startClassHandler = async () => {
        const classSetting = buildClassSetting(classroomNameRef.current.value, classroomDescRef.current.value, classroomTimeRef.current.value)
        setOpenSelfClassroom(true)
        openClassroom(classroomWs, classSetting)
    }

    return (
        <div>
            <section className='StartClassSection'>
                <h2>開啟教室：</h2>
                <form className='ClassForm' onSubmit={(event) => event.preventDefault()}>
                    教室名稱：<br/>
                    <input ref={classroomNameRef} type="text"></input>
                    <br/>
                    教室簡介：<br/>
                    <textarea ref={classroomDescRef} className='TextArea' name="" id="" cols="10" rows="5"></textarea>
                    <br/>
                    <label htmlFor="class time">課堂時間：</label>
                    <br/>
                    <select ref={classroomTimeRef} name="class_time">
                        <option value="15">15分鐘</option>
                        <option value="30">30分鐘</option>
                        <option value="60">60分鐘</option>
                        <option value="90">90分鐘</option>
                    </select>
                    <br/>
                    <br/>
                    <button onClick={startClassHandler}>start class</button>
                </form>
            </section>
        </div>
    )   
}

export default ClassForm