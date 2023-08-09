import { getClassroomId } from "../../../api_handler/classroom_api_handler";
import { getUserId } from "../../../cookie_handler/user_cookie_handler";
import { successToast } from "../../../service/toast_service";

export async function openClassroom(classroomWs, classSetting) {
    classroomWs.send(
        JSON.stringify({
            cmd: "open room",
            senderId: getUserId(),
            applicationType: "web",
            classroomId: await getClassroomId(),
            message: JSON.stringify(classSetting)
        })
    )
}

export async function closeClassroom(classroomWs, setRemoteStream, setLocalStream, setSelfClassroomInfo) {
    classroomWs.send(
        JSON.stringify({
            cmd: "close room",
            senderId: getUserId(),
            applicationType: "web",
            classroomId: await getClassroomId(),
            message: ""
        })
    )

    setSelfClassroomInfo({status: "offline"})
    setRemoteStream({})
    setLocalStream({})
}

export async function leaveClassroom(classroomWs, teacherClassroomId, setTeacherClassroomInfo, setRemoteStream, setLocalStream, setIsInClassroom) {
    classroomWs.send(
        JSON.stringify({
            cmd: "leave room",
            senderId: getUserId(),
            applicationType: "web",
            classroomId: teacherClassroomId,
            message: ""
        })
    )
    setTeacherClassroomInfo(null)
    setRemoteStream({})
    setLocalStream({})
    setIsInClassroom(false)
}

export async function onRequireAccess(classroomWs, setOpenModal, setModalContant, message) {
    const userInfo = JSON.parse(message.message)

    setModalContant({
        title: userInfo.userNickname + "想要加入教室",
        body: "要允許其加入教室嗎？",
        confirmFunction: () => {
            accepetAccess(classroomWs, message.senderId, message.applicationType)
        },
        cancelFunction: () => {
            rejectAccess(classroomWs, message.senderId, message.applicationType)
        }
    })
    setOpenModal(true)
}

export function showEnterConfirmModal(classroomWs, classroomInfo, setModalContant, setOpenModal, setWaitingInfo) {
    setModalContant({
        title: "即將進入" + classroomInfo.teacherNickname + "的教室",
        body: "上課時間：" + classroomInfo.classTime,
        confirmFunction: () => {
            accessClassroom(classroomWs, classroomInfo, setWaitingInfo)
        },
        cancelFunction: () => {

        }
    })

    setOpenModal(true)
}

export async function onAcceptAccess(classroomWs, waitingInfo, message, setWaitingInfo, setTeacherClassroomInfo, setIsInClassroom) {
    if(waitingInfo === null || message.classroomId !== waitingInfo.classroomId) {
        return
    }
    
    setWaitingInfo(null)
    setIsInClassroom(true)
    setTeacherClassroomInfo({classroomId: message.classroomId, teacherId: message.senderId})
    joinClassroom(classroomWs, message.classroomId, message.senderId, message.message)
}

export async function onJoinRoom(message, teacherClassroomInfo, selfClassroomInfo, setSelfClassroomInfo) {
    const selfClassroomId = await getClassroomId()

    if(teacherClassroomInfo && message.classroomId === teacherClassroomInfo.classroomId) {
        successToast("join room success")
        return
    }

    if(message.classroomId === selfClassroomId) {
        selfClassroomInfo.status = "in class"
        setSelfClassroomInfo(selfClassroomInfo)
    }

    // todo: turn classroom status to in class
}

// export async function onLeaveRoom(message, selfClassroomInfo, setSelfClassroomInfo) {
//     const selfClassroomId = await getClassroomId()
    
//     if(message.classroomId === selfClassroomId) {
//         selfClassroomInfo.status = "online"
//         setSelfClassroomInfo(selfClassroomInfo)
//     }
// }

const joinClassroom = (classroomWs, classroomId, receiverId, classroomToken) => {
    classroomWs.send(JSON.stringify({
        "cmd": "join room",
        "senderId": getUserId(),
        "applicationType": "web",
        "classroomId": classroomId,
        "recieverId": receiverId,
        "message": classroomToken,
    }))
}

const accessClassroom = async (classroomWs, classroomInfo, setWaitingInfo) => {
    setWaitingInfo({
        teacherNickname: classroomInfo.teacherNickname,
        classroomId: classroomInfo.classroomId
    })
    classroomWs.send(JSON.stringify({
        "cmd": "ask",
        "senderId": getUserId(),
        "applicationType": "web",
        "classroomId": classroomInfo.classroomId
    }))
}

const accepetAccess = async (classroomWs, receiverId, receiverApplicationType) => {
    classroomWs.send(
        JSON.stringify({
            cmd: "accept",
            senderId: getUserId(),
            applicationType: "web",
            recieverId: receiverId,
            receiverApplicationType: receiverApplicationType,
            classroomId: await getClassroomId(),
            message: ""
        })
    )
}

const rejectAccess = async (classroomWs, receiverId, receiverApplicationType) => {
    classroomWs.send(
        JSON.stringify({
            cmd: "reject",
            senderId: getUserId(),
            applicationType: "web",
            recieverId: receiverId,
            receiverApplicationType: receiverApplicationType,
            classroomId: await getClassroomId(),
            message: ""
        })
    )
}