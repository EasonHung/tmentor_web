
export function buildClassSetting(title, desc, classTime) {
    return {
        settingName: title,
        title: title,
        desc: desc,
        classTime: parseInt(classTime, 10),
        classPoints: 0
    }
}