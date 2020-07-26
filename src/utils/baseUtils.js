async function judgeType(data, parseType) {
    if (parseType === null) {
        return null
    }
    if (parseType === '3'){
        return data.vod.music
    } else if(parseType === '2'){
        return data.live.video
    } else if(parseType === '1'){
        return data.vod.video
    }

}

exports.judgeType = judgeType