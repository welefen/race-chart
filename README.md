# DataRace

## webm 转 mp4

```
ffmpeg -i video.webm video.mp4
```

## mp4 添加音频

```
ffmpeg -i video.mp4 -i 1.mp3 -c:v copy -c:a aac -strict experimental -shortest out.mp4
```