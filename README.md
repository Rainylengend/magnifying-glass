# 商城放大镜插件

> Zoom
##原生方法，兼容至ie5

## 使用方法

> HTML

```html
<div id="demo"> </div>

```

> CSS

```css
#demo{
          position:relative;
          width: /*图片等比例缩放后的宽度;  （例如要把原图为1920*1080的图片放大5倍 则这里的宽度为 1920/5）*/
          height: /*图片等比例缩放后的高度; （高度同理）*/
          background: /*图片的路径*/
}
```

> JS

```javascript

new Zoom({
          el: demo, /*放大镜的容器，必填，容器必须设置relative定位*/

          times: ,/*图片的放大倍数，默认为5倍*/

          pointerAreaSize: , /*设置随鼠标移动的小方块的尺寸默认为50*/

          pointerAreaBg: , /* 设置随鼠标移动的小方框的背景颜色默认为#333*/

          bigArea: {
           background: , /*放大显示区的放大图片 格式为 url(路径) 为必填项*/

           left: ,/*相对于父容器的位置 默认在父容器的最右边，需要带单位(px) ps:选填*/

           top: /* 同上默认在最上方*/
          }
})
```

# 自用小插件，如果您喜欢请给一个star
