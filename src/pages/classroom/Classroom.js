import { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from './components/navbar'
import MyclassroomItem from './components/MyclassroomItem'
import BorderLine from './components/BorderLine'
import ClassroomVideo from './components/ClassroomVideo';
import ClassForm from './components/ClassForm';
import ClassroomModal from './components/ClassroomModal';
import { getUserId } from '../../cookie_handler/user_cookie_handler'
import ClassroomList from './components/ClassroomList';
import { fetchClassroomList, classroomOpen, classroomClose, fetchSelfClassroomInfo } from './service/classroom_list_service';
import { closeClassroom, leaveClassroom, onAcceptAccess, onJoinRoom, onRequireAccess } from './service/classroom_access_service';
import { fetchUserInfo } from './service/user_service';
import { startHeartBeat, stopHeartBeat } from './service/ws_heartbeat_service';
import { onRTCOffer, onICECandidate, startPeerConnection, onAnswer } from './service/webRTC_service';
import WaitingInfo from './components/WaitingInfo';

function ClassroomPage() {
    const classroomWsUrl = "ws://35.229.189.182/ws/classroom"
    const heartbeatTimeoutIdRef = useRef(null)
    const navigate = useNavigate()
    const [ws,setWs] = useState(new WebSocket(classroomWsUrl + "/?userId=" + getUserId() + "&applicationType=web"))
    const [isInClassroom, setIsInClassroom] = useState(false)
    const [selfClassroomInfo, setSelfClassroomInfo] = useState({})
    const [teacherClassroomInfo, setTeacherClassroomInfo] = useState(null)
    const [openSelfClassroom, setOpenSelfClassroom] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [classroomList, setClassroomList] = useState([])
    const [userInfo, setUserInfo] = useState({})
    const [remoteStream, setRemoteStream] = useState({})
    const [localStream, setLocalStream] = useState({})
    const [waitingInfo, setWaitingInfo] = useState(null)
    const [openModal, setOpenModal] = useState(false)
    const [modalContant, setModalContant] = useState({})
    const stateRef = useRef();

    stateRef.classroomList = classroomList

    const fetchClassroomListCallBack = useCallback( () => {
        fetchClassroomList(setIsLoading, setClassroomList, setSelfClassroomInfo)
    }, [])

    const fetchUserInfoCallBack = useCallback( () => {
        fetchUserInfo(setUserInfo)
    }, [])

    const closeClassroomCallBack = async () => {
        closeClassroom(ws, setRemoteStream, setLocalStream, setSelfClassroomInfo)
    }

    const leaveClassroomCallBack = async () => {
        leaveClassroom(ws, teacherClassroomInfo.classroomId, setTeacherClassroomInfo, setRemoteStream, setLocalStream, setIsInClassroom)
    }

    const listenWsCallBack = useCallback( () => {
        ws.onclose = () => {
            stopHeartBeat(heartbeatTimeoutIdRef.val)
            console.log("close ws")
        }

        ws.onopen = () => {
            heartbeatTimeoutIdRef.val = startHeartBeat(ws)
            console.log("open ws")
        }

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data)
            console.log(message.cmd)
            switch(message.cmd) {
                case "open room":
                    classroomOpen(stateRef.classroomList, setClassroomList, message, setIsInClassroom, setLocalStream, setSelfClassroomInfo)
                    break;
                case "close room":
                    classroomClose(stateRef.classroomList, setClassroomList, message.classroomId, setIsInClassroom, selfClassroomInfo, setSelfClassroomInfo)
                    break;
                case "ask":
                    onRequireAccess(ws, setOpenModal, setModalContant, message)
                    break;
                case "accept":
                    onAcceptAccess(ws, waitingInfo, message, setWaitingInfo, setTeacherClassroomInfo, setIsInClassroom)
                    break;
                case "join room":
                    onJoinRoom(message, teacherClassroomInfo, selfClassroomInfo, setSelfClassroomInfo)
                    startPeerConnection(ws, teacherClassroomInfo, setRemoteStream, setLocalStream, message)
                    break;
                case "leave room":
                    fetchSelfClassroomInfo(setSelfClassroomInfo)
                    break; 
                case "offer":
                    onRTCOffer(setRemoteStream, localStream, message, ws)
                    break;
                case "answer":
                    onAnswer(message)
                    break;
                case "candidate":
                    onICECandidate(message)
                    break;
                default:
                    console.log("default")
                    console.log(message)
            }
        }
    }, [ws, localStream, waitingInfo, teacherClassroomInfo])

    useEffect(() => {
        if(getUserId() === undefined) {
            navigate('/')
        }

        fetchClassroomListCallBack()
        fetchUserInfoCallBack()
        listenWsCallBack()

    }, [fetchClassroomListCallBack, navigate, fetchUserInfoCallBack, listenWsCallBack])

    return (
        <div className='base'>
            <Navbar/>
            <div className='content'>
                <div className='mediaArea'>
                    { !isInClassroom && waitingInfo === null && <ClassForm 
                        classroomWs={ws} 
                        setOpenSelfClassroom={setOpenSelfClassroom}/> }
                    <ClassroomVideo 
                        teacherClassroomInfo={teacherClassroomInfo}
                        waitingInfo={waitingInfo}
                        isInClassroom={isInClassroom}
                        localStream={localStream}
                        remoteStream={remoteStream}
                        closeClassroomCallBack={closeClassroomCallBack} 
                        leaveClassroomCallBack={leaveClassroomCallBack}
                        openSelfClassroom={openSelfClassroom}/> 
                    { openModal && <ClassroomModal setOpenModal={setOpenModal} modalContant={modalContant}/> }
                    { waitingInfo && <WaitingInfo waitingInfo={waitingInfo} setWaitingInfo={setWaitingInfo}/> }
                </div>
                <div className='listArea'>
                    <MyclassroomItem userInfo={userInfo} selfClassroomInfo={selfClassroomInfo}/>
                    <BorderLine/>
                    { !isLoading && 
                    <ClassroomList 
                        classroomList={classroomList} 
                        setOpenModal={setOpenModal} 
                        setModalContant={setModalContant}
                        classroomWs={ws}
                        setWaitingInfo={setWaitingInfo}/> }
                    { isLoading && <p>loading...</p>}
                </div>
            </div>
        </div>
    )
}

export default ClassroomPage