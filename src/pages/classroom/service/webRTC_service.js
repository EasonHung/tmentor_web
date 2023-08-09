import { getClassroomId } from "../../../api_handler/classroom_api_handler";
import { getUserId } from "../../../cookie_handler/user_cookie_handler";

const iceServers = {
    'iceServers': [
        // {'url': 'stun:stun.l.google.com:19302'},
        {
        "url": "turn:relay1.expressturn.com:3478",
        "username": "efC2OT8W129D2ID63H",
        "credential": "6ZeChztFE4cxEmgg",
        },
    ]
};
// const videoConstraints = {
//     audio: false, 
//     video: true
// }

let pc = null


export async function onRTCOffer(setRemoteStream, localStream, message, classroomWs) {
    pc = new RTCPeerConnection(iceServers);

    pc.ontrack = (event) => {
        setRemoteStream(event.streams[0])
    };

    pc.onicecandidate = async ({candidate}) => {
        if(candidate != null) {
            classroomWs.send(
                JSON.stringify({
                    "cmd": "candidate",
                    "senderId": getUserId(),
                    "applicationType": "app",
                    "recieverId": message.senderId,
                    "classroomId": await getClassroomId(),
                    "message": {
                      'sdpMLineIndex': candidate.sdpMLineIndex,
                      'sdpMid': candidate.sdpMid,
                      'candidate': candidate.candidate,
                    }
                })
            )
        }
    }

    try {
        localStream.getTracks().forEach( (track) =>
          pc.addTrack(track, localStream)
        )
    } catch (err) {
        console.error(err);
    }

    await pc.setRemoteDescription(new RTCSessionDescription(message.message));

    await pc.setLocalDescription(await pc.createAnswer());

    classroomWs.send(
        JSON.stringify({
            "cmd": "answer",
            "senderId": getUserId(),
            "applicationType": "web",
            "recieverId": message.senderId,
            "classroomId": await getClassroomId(),
            "message": {
              'sdp': pc.localDescription.sdp,
              'type': pc.localDescription.type,
            }
        })
    )
}

export async function onICECandidate(message) {
    if(pc !== null) {
        pc.addIceCandidate(new RTCIceCandidate(message.message));
    }
}

export async function startLocalStream(setLocalStream) {
    const stream = await navigator.mediaDevices.getUserMedia({audio: false, video: true})
    setLocalStream(stream)
    return stream
}

export function stopLocalStream(setLocalStream) {
    setLocalStream({})
}

export function closePeerConnection() {
    if(pc) {
        pc.close()
        pc = null
    }
}

export async function startPeerConnection(classroomWs, teacherClassroomInfo, setRemoteStream, setLocalStream, message) {
    if(message.senderId !== getUserId() || message.applicationType !== "web") {
        return
    }

    pc = new RTCPeerConnection(iceServers);

    pc.ontrack = (event) => {
        setRemoteStream(event.streams[0])
    };

    pc.onicecandidate = async ({candidate}) => {
        if(candidate != null) {
            classroomWs.send(
                JSON.stringify({
                    "cmd": "candidate",
                    "senderId": getUserId(),
                    "applicationType": "web",
                    "recieverId": teacherClassroomInfo.teacherId,
                    "classroomId": teacherClassroomInfo.classroomId,
                    "message": {
                      'sdpMLineIndex': candidate.sdpMLineIndex,
                      'sdpMid': candidate.sdpMid,
                      'candidate': candidate.candidate,
                    }
                })
            )
        }
    }

    const localStream = await startLocalStream(setLocalStream)

    try {
        localStream.getTracks().forEach( (track) =>
          pc.addTrack(track, localStream)
        )
    } catch (err) {
        console.error(err);
    }

    await pc.setLocalDescription(await pc.createOffer());

    classroomWs.send(
        JSON.stringify({
            "cmd": "offer",
            "senderId": getUserId(),
            "applicationType": "web",
            "recieverId": teacherClassroomInfo.teacherId,
            "classroomId": teacherClassroomInfo.classroomId,
            "message": {
              'sdp': pc.localDescription.sdp,
              'type': pc.localDescription.type,
            }
        })
    )
}

export function onAnswer(message) {
    if(pc) {
        pc.setRemoteDescription(new RTCSessionDescription(message.message));
    }
}