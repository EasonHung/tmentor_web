import { getClassroomId, getClassroomList, getClassroomInfo } from "../../../api_handler/classroom_api_handler";
import { infoToast, successToast } from "../../../service/toast_service";
import { startLocalStream } from "./webRTC_service";

export async function fetchClassroomList(setIsLoading, setClassroomList, setSelfClassroomInfo) {
    let classroomList
    let selfClassroomInfo
    const selfClassroomId = await getClassroomId()

    try {
        classroomList = await getClassroomList()
    } catch(e) {
        alert(e)
    }

    try {
        selfClassroomInfo = await getClassroomInfo(selfClassroomId)
    } catch(e) {
        alert(e)
    }

    setSelfClassroomInfo(selfClassroomInfo)
    setClassroomList(classroomList)
    setIsLoading(false)
    return classroomList
}

export async function fetchSelfClassroomInfo(setSelfClassroomInfo) {
    const selfClassroomId = await getClassroomId()
    let selfClassroomInfo

    try {
        selfClassroomInfo = await getClassroomInfo(selfClassroomId)
    } catch(e) {
        alert(e)
    }

    setSelfClassroomInfo(selfClassroomInfo)
}

export async function classroomOpen(originClassroomList, setClassroomList, message, setIsInClassroom, setLocalStream, setSelfClassroomInfo) {
    const userClassroomId = await getClassroomId()

    if(message.classroomId === userClassroomId && message.applicationType === "app") {
        let selfClassroomInfo
        successToast("open classroom success")
        try {
            selfClassroomInfo = await getClassroomInfo(userClassroomId)
        } catch(e) {
            alert(e)
        }
        setSelfClassroomInfo(selfClassroomInfo)
        return
    }

    if(message.classroomId === userClassroomId) {
        successToast("open classroom success")
        setIsInClassroom(true)
        startLocalStream(setLocalStream)
        return
    }

    const newList = originClassroomList.map((classroom) => {
        if(classroom.classroomId === message.classroomId) {
            const classSetting = JSON.parse(message.message)
            return {...classroom, classTime: classSetting.classTime, status: 'online'}
        }
        return classroom
    })
    setClassroomList(newList)
}

export async function classroomClose(originClassroomList, setClassroomList, classroomId, setIsInClassroom, selfClassroomInfo, setSelfClassroomInfo) {
    const userClassroomId = await getClassroomId()

    if(classroomId === userClassroomId) {
        infoToast("close classroom success")
        setIsInClassroom(false)
        selfClassroomInfo.status = "offline"
        setSelfClassroomInfo(selfClassroomInfo)
        return
    }

    const newList = originClassroomList.map((classroom) => {
        if(classroom.classroomId === classroomId) {
            return {...classroom, classTime: 0, status: 'offline'}
        }
        return classroom
    })
    setClassroomList(newList)
}