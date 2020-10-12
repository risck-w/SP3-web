function UUID() {
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c==='x' ? r : ((r & 0x3) | 0x8)).toString(16);
    });
    return uuid;
    };


async function formatData(result) {
    if (result === null) {
        return null
    }
    const videoData = {
        sources : {}
    }

    const source = {
        bitrate: 0,
        duration: 0,
        format: 'mp4',
        height: 0,
        width: 0,
        play_url: '',
        size: 0,
        autoplay: true
    }

    Object.keys(result).forEach(key => {
        videoData.sources[key] = source
        Object.keys(result[key].data).forEach(item => {
            videoData['sources'][key][item] = result[key]['data'][item]
        })
        
        videoData.title = result[key]['name'] || ''
        videoData.cover = result[key]['img'] || ''
        videoData.autoplay = true
        videoData.duration = result[key].data.duration || 0
        videoData.__griffithId = UUID()

    })
    return videoData

}

exports.formatData = formatData