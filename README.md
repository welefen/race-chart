# DataRace

## webm 转 mp4

```
ffmpeg -i video.webm video.mp4
```

## mp4 添加音频

```
ffmpeg -i video.mp4 -i 1.mp3 -c:v copy -c:a aac -strict experimental -shortest out.mp4
```

## DataRace format

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

## 视频转 gif

```
ffmpeg -t 3 -ss 00:00:02 -i small.webm small-clip.gif
```