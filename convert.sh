#!/bin/sh

cd video/;

# ffmpeg -i video.webm video.mp4;
ffmpeg -i video.webm -i 1.mp3 -c:v copy -c:a aac -strict experimental -shortest out.mp4

# rm -rf video.webm;
# rm -rf video.mp4;