# OpenCV (Open Source Computer Vision) is a computer vision library that contains various functions to perform operations on Images or videos. OpenCV library can be used to perform multiple operations on videos.

# Let’s see how to play a video using the OpenCV Python.

# To capture a video, we need to create a VideoCapture object. VideoCapture have the device index or the name of a video file. Device index is just the number to specify which camera. If we pass 0 then it is for first camera, 1 for second camera so on. We capture the video frame by frame.
# cv2.VideoCapture(0): Means first camera or webcam.
# cv2.VideoCapture(1):  Means second camera or webcam.
# cv2.VideoCapture("file name.mp4"): Means video file

# importing libraries
import cv2
import numpy as np

# Create a VideoCapture object and read from input file
cap = cv2.VideoCapture('tree.mp4')

# Check if camera opened successfully
if (cap.isOpened()== False):
print("Error opening video file")

# Read until video is completed
while(cap.isOpened()):
	
# Capture frame-by-frame
ret, frame = cap.read()
if ret == True:

	# Display the resulting frame
	cv2.imshow('Frame', frame)

	# Press Q on keyboard to exit
	if cv2.waitKey(25) & 0xFF == ord('q'):
	break

# Break the loop
else:
	break

# When everything done, release
# the video capture object
cap.release()

# Closes all the frames
cv2.destroyAllWindows()
