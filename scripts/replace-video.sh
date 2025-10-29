#!/bin/bash

# Script to replace the hero video with your own video
# Usage: ./scripts/replace-video.sh /path/to/your/video.mp4

if [ $# -eq 0 ]; then
    echo "Usage: $0 /path/to/your/video.mp4"
    echo "Example: $0 ~/Downloads/my-video.mp4"
    exit 1
fi

SOURCE_VIDEO="$1"
TARGET_DIR="/Users/abba/Desktop/vp0/public/videos"
TARGET_FILE="$TARGET_DIR/hero-video.mp4"

# Check if source file exists
if [ ! -f "$SOURCE_VIDEO" ]; then
    echo "Error: Source video file '$SOURCE_VIDEO' does not exist."
    exit 1
fi

# Check if target directory exists
if [ ! -d "$TARGET_DIR" ]; then
    echo "Error: Target directory '$TARGET_DIR' does not exist."
    exit 1
fi

# Get file size
FILE_SIZE=$(du -h "$SOURCE_VIDEO" | cut -f1)
echo "Source video size: $FILE_SIZE"

# Copy the video
echo "Copying video to $TARGET_FILE..."
cp "$SOURCE_VIDEO" "$TARGET_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Video successfully replaced!"
    echo "The new video will appear in the hero section when you refresh the page."
    echo ""
    echo "Note: For best performance, ensure your video is:"
    echo "- Under 10MB in size"
    echo "- 30-60 seconds long"
    echo "- MP4 format (H.264 codec)"
    echo "- 1920x1080 or 1280x720 resolution"
else
    echo "❌ Error copying video file."
    exit 1
fi
