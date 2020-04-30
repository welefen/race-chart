# DataRace

## webm 转 mp4

```
ffmpeg -i video.webm video.mp4
```

## mp4 添加音频

```
ffmpeg -i video.webm -i 1.mp3 -c:a aac -strict experimental -shortest out.mp4
```

## BarRace format

```
{
  "columnNames": [],
  "data": [
    {
      "image": "http://p5.qhimg.com/t014895ec8287387110.png",
      "label": "Angola",
      "values": [],
      "category": "Africa"
    }
  ]
}
```

## BarRank format

```
[{
  "image": "",
  "label": "",
  "value": 0
}]
```

## 视频转 gif

```
ffmpeg -t 3 -ss 00:00:02 -i small.webm small-clip.gif
```

## 背景图

* 世界地图： https://p2.ssl.qhimg.com/t0146b4c543914fa3a4.png