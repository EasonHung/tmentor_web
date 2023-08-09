const heartBeatInterval = 15000

export function startHeartBeat(classroomWs) {
    return setTimeout(() => {
        classroomWs.send(
            JSON.stringify({
                cmd: "ping"
            })
        )
    }, heartBeatInterval)
}

export function stopHeartBeat(timeoutId) {
    clearTimeout(timeoutId)
}