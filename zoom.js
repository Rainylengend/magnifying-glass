/**
 * Created by Administrator on 2017/3/4.
 */
/*
 *  使用方法
 *  html元素为 <div id="demo"></div>
 *  css为  #demo{
 *    position:relative;
 *    width:图片等比例缩放后的宽度;  （例如要把原图为1920*1080的图片放大5倍 则这里的宽度为 1920/5）
 *    height:图片等比例缩放后的高度; （高度同理）
 *    background:图片的路径
 *  }
 *  JS为：new Zoom({
 *   el: ,放大镜的容器，必填，容器必须设置relative定位
 *   times:图片的放大倍数，默认为5倍,
 *   pointerAreaSize: 设置随鼠标移动的小方块的尺寸默认为50,
 *   pointerAreaBg: 设置随鼠标移动的小方框的背景颜色默认为#333,
 *   bigArea: {
 *     background: 放大显示区的放大图片 格式为 url(路径) 为必填项,
 *     left:相对于父容器的位置 默认在父容器的最右边,
 *     top:同上默认在最上方
 *   }
 * })
 *
 */
(function () {
  var Zoom = function (config) {

    this.config = config;
    this.el = this.config.el;
    //判断配置是否合法
    if (!this.config.bigArea && typeof this.config.bigArea !== 'object')
      throw new Error('必须对bigArea配置参数');

    if (!this.config.bigArea.background)
      throw new Error('必须对bigArea配置参数background');

    //初始化配置 times:放大倍数
    this.config.times = this.config.times || 5;
    this.config.pointerAreaSize = this.config.pointerAreaSize || 50;
    this.config.pointerAreaBg = this.config.pointerAreaBg || '#333';

    //对放大显示框做配置
    this.config.bigArea.position = 'absolute';
    this.config.bigArea.left = this.config.bigArea.left || this.el.offsetWidth + 'px';
    this.config.bigArea.top = this.config.bigArea.top || 0;
    this.config.bigArea.width = this.config.bigArea.height = this.config.pointerAreaSize * this.config.times + 'px';

    this.init();
  };

  Zoom.prototype = {
    init: function () {
      var self = this,
          pointerArea,
          bigArea;


      //生成单列的代理函数
      var proxySingle = (function () {
            var el;

            return function (callback) {

              if (!el)
                el = callback.apply(self);

              return el;
            }

          })(),
          proxySingleBig = (function () {
            var el;

            return function (callback) {

              if (!el)
                el = callback.apply(self);

              return el;
            }

          })();

      var mouseenter = function (e) {
            self.scrollTop =document.body.scrollTop || document.documentElement.scrollTop;

            pointerArea = proxySingle(self.createPointerArea);
            bigArea = proxySingleBig(self.createBigArea);
            pointerArea.style.display = 'block';
            bigArea.style.display = 'block';
          },
          mousemove = function (e) {

            var pointer = {
              x: e.clientX - self.el.offsetLeft - pointerArea.offsetWidth / 2,
              y: e.clientY + self.scrollTop - self.el.offsetTop - pointerArea.offsetHeight / 2
            };

            pointerArea.style.top = pointer.y + 'px';
            pointerArea.style.left = pointer.x + 'px';

            //放大显示区域的默认行为
            self.bigAreaBehavior(e, pointerArea, bigArea);

            //逃出放大镜区域临界判定，此函数可能存在问题
            self.limit(e, pointer, pointerArea, bigArea);

          },
          mouseleave = function () {
            pointerArea.style.display = 'none';
            bigArea.style.display = 'none';
            mousemove = null;
          };

      window.addEventListener ? this.el.addEventListener('mouseenter', mouseenter, false) : this.el.attachEvent('onmouseenter', mouseenter);
      window.addEventListener ? this.el.addEventListener('mousemove', mousemove, false) : this.el.attachEvent('onmousemove', mousemove);
      window.addEventListener ? this.el.addEventListener('mouseleave', mouseleave, false) : this.el.attachEvent('onmouseleave', mouseleave);

    },
    bigAreaBehavior: function (e, pointerArea, bigArea) {
      var self = this;

      setTimeout(function () {
        var x = -pointerArea.offsetLeft * self.config.times;
        var y = -pointerArea.offsetTop * self.config.times;

        bigArea.style.backgroundPosition = x + 'px ' + y + 'px';
      }, 0)


    },

    //边界判定的函数
    limit: function (e, pointer, pointerArea, bigArea) {
      var self = this,
          limit = {
            right: self.el.offsetLeft + self.el.offsetWidth - pointerArea.offsetWidth / 2,
            left: self.el.offsetLeft + pointerArea.offsetWidth / 2,
            top: self.el.offsetTop + pointerArea.offsetHeight / 2,
            bottom: self.el.offsetTop + self.el.offsetHeight - pointerArea.offsetHeight / 2
          };

      if (e.clientX >= self.el.offsetLeft + self.el.offsetWidth) {
        bigArea.style.display = 'none';
      }

      if (e.clientX >= limit.right) {
        pointerArea.style.left = self.el.offsetWidth - pointerArea.offsetWidth + 'px'
      }

      if (e.clientX <= limit.left) {
        pointerArea.style.left = 0 + 'px'
      }

      if (e.clientY + self.scrollTop >= limit.bottom) {
        pointerArea.style.top = self.el.offsetHeight - pointerArea.offsetHeight + 'px'
      }

      if (e.clientY + self.scrollTop <= limit.top) {
        pointerArea.style.top = 0 + 'px'
      }
    },

    //创建一个随鼠标移动的放大选区
    createPointerArea: function () {
      var pointerArea = document.createElement('div');

      pointerArea.style.position = 'absolute';
      pointerArea.style.width = pointerArea.style.height = this.config.pointerAreaSize + 'px';
      pointerArea.style.background = this.config.pointerAreaBg;
      pointerArea.style.filter = 'Alpha(opacity=40)';
      pointerArea.style.opacity = '.4';

      this.el.appendChild(pointerArea);

      return pointerArea;
    },

    //创建放大区域
    createBigArea: function () {
      var bigArea = document.createElement('div');

      for (var i in this.config.bigArea) {
        bigArea.style[i] = this.config.bigArea[i];
      }

      this.el.appendChild(bigArea);

      return bigArea;
    }
  };

  return window.Zoom = Zoom;
})();