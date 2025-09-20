# 背景图片设置说明

## 如何添加火焰背景图片

1. 将您提供的火焰能量图片保存为 `flame-background.jpg`
2. 将图片文件放置在项目根目录中（与 `index.html` 同级）
3. 确保文件名为 `flame-background.jpg`

## 文件结构应该是：
```
ziqian-space/
├── flame-background.jpg  ← 您的火焰图片
├── index.html
├── home.html
├── home-style.css
├── tank-math.html
└── ... 其他文件
```

## 背景效果说明

- 图片将作为整个网站的固定背景
- 透明度设置为 40%，不会影响内容阅读
- 背景图片会自动适应屏幕大小
- 在所有页面中都会显示相同的背景

## 如果需要调整

如果您想调整背景的透明度，可以在 `home-style.css` 文件中修改：
```css
body::before {
    opacity: 0.4; /* 调整这个值，0.1-0.6 之间比较合适 */
}
```

## 支持的图片格式
- .jpg
- .jpeg  
- .png
- .webp
