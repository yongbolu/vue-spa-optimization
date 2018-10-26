<template>
  <div class="b-map-marker" :style="{height:height}"></div>
</template>

<script>
  export default {
    name: 'BMapMarker',
    props: {
      data: {
        type: Array,
        default: () => []
      },
      height: {
        type: String,
        default: '200px'
      }
    },
    data () {
      return {
        map: null
      }
    },
    watch: {
      data () {
        this.initMap()
      }
    },
    mounted () {
      this.initMap()
    },
    methods: {
      initMap () {
        if (this.data.length === 0) return
        this.importMap('A6NoSO9Uz4bHLz2erZw3hNGo').then(BMap => {
          this.map = new BMap.Map(this.$el)
          const point = new BMap.Point(this.data[0][0], this.data[0][1])
          this.map.centerAndZoom(point, 13)
          this.map.enableScrollWheelZoom(true)
          // 添加地图左上角缩放控件
          const navigationControl = new BMap.NavigationControl({
            anchor: BMap.BMAP_ANCHOR_TOP_LEFT,
            type: BMap.BMAP_NAVIGATION_CONTROL_LARGE,
            enableGeolocation: true
          })
          this.map.addControl(navigationControl)
          // 绘制标注
          for (var i = 0; i < this.data.length; i++) {
            const marker = new BMap.Marker(new BMap.Point(this.data[i][0], this.data[i][1]))   // 创建标注
            const content = `优先级：${i + 1}</br>姓名：${this.data[i][2]}<br/>电话：${this.data[i][3]}<br/>地址：${this.data[i][4]}` // 标注弹窗内容
            this.map.addOverlay(marker)               // 将标注添加到地图中
            const label = new BMap.Label(i + 1, { offset: new BMap.Size(5, -5) })
            marker.setLabel(label)
            addClickHandler(content, marker)
          }

          // 绑定标注点击事件
          function addClickHandler (content, marker) {
            marker.addEventListener('click', function (e) {
              openInfo(content, e)
            })
          }

          //  点击弹出弹窗
          const openInfo = (content, e) => {
            var p = e.target
            var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat)
            var infoWindow = new BMap.InfoWindow(content)  // 创建信息窗口对象
            this.map.openInfoWindow(infoWindow, point)    // 开启信息窗口
          }
        }).catch(err => console.error(err))
      },
      importMap (ak) {
        return new Promise((resolve, reject) => {
          if (window.BMap) {
            resolve(window.BMap)
          } else {
            let script = document.createElement('script')
            script.type = 'text/javascript'
            script.src = 'http://api.map.baidu.com/api?v=3.0&ak=' + ak + '&callback=init'
            script.onerror = reject
            document.head.appendChild(script)
            window.init = () => {
              resolve(window.BMap)
            }
          }
        })
      }
    }
  }
</script>

<style scoped>

</style>
