/**
 * Created by huangjin on 17/11/4.
 */
// 本地文件上传转base64的promise封装
export function uploadImgToBase64 (file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = function () {
      resolve(reader)
    }
    reader.onerror = reject
  })
}

// 在线网络图片转base64的promise封装
export function URLImgToBase64 (img) {
  return new Promise((resolve, reject) => {
    function getBase64Image (img) {
      const canvas = document.createElement('canvas')
      // 图片原始尺寸
      let originWidth = img.width
      let originHeight = img.height
      // 最大尺寸限制
      let maxWidth = 750
      let maxHeight = 430
      // 目标尺寸
      let targetWidth = originWidth
      let targetHeight = originHeight
      // 图片尺寸超过750x430的限制
      if (originWidth > maxWidth || originHeight > maxHeight) {
        if (originWidth / originHeight > maxWidth / maxHeight) {
          // 更宽，按照宽度限定尺寸
          targetWidth = maxWidth
          targetHeight = Math.round(maxWidth * (originHeight / originWidth))
        } else {
          targetHeight = maxHeight
          targetWidth = Math.round(maxHeight * (originWidth / originHeight))
        }
      }

      // canvas对图片进行缩放
      canvas.width = targetWidth
      canvas.height = targetHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      var dataURL = canvas.toDataURL()
      return dataURL
    }

    const image = new Image()
    image.crossOrigin = '*'  // 允许跨域图片
    image.src = img + '?v=' + Math.random()  // 清除图片缓存
    console.log(img)
    image.onload = function () {
      resolve(getBase64Image(image))
    }
    image.onerror = reject
  })
}

export function deepClone (source) {
  if (!source && typeof source !== 'object') {
    throw new Error('error arguments', 'shallowClone')
  }
  const targetObj = source.constructor === Array ? [] : {}
  for (const keys in source) {
    if (source.hasOwnProperty(keys)) {
      if (source[keys] && typeof source[keys] === 'object') {
        targetObj[keys] = source[keys].constructor === Array ? [] : {}
        targetObj[keys] = deepClone(source[keys])
      } else {
        targetObj[keys] = source[keys]
      }
    }
  }
  return targetObj
}
