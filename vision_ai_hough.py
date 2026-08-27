import cv2
import numpy as np

URL = "http://192.168.4.2:81/stream" 
cap = cv2.VideoCapture(URL)
if not cap.isOpened():
    print("Could not connect to camera!")
    exit()

def nothing(x):
    pass

cv2.namedWindow("Geometric Anomaly Scanner")
cv2.createTrackbar("Canny Min", "Geometric Anomaly Scanner", 50, 255, nothing)
cv2.createTrackbar("Canny Max", "Geometric Anomaly Scanner", 150, 255, nothing)
cv2.createTrackbar("Min Tear Length", "Geometric Anomaly Scanner", 20, 150, nothing)

print("\n" + "="*50)
print("GEOMETRIC HOUGH TRANSFORM DETECTOR")
print("Targeting structural linear tears and cuts...")
print("="*50 + "\n")

while True:
    ret, frame = cap.read()
    if not ret:
        continue
    
    height, width, _ = frame.shape
    roi_x, roi_y = int(width * 0.2), int(height * 0.2)
    roi_w, roi_h = int(width * 0.6), int(height * 0.6)
    roi = frame[roi_y:roi_y+roi_h, roi_x:roi_x+roi_w]
    
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    c_min = cv2.getTrackbarPos("Canny Min", "Geometric Anomaly Scanner")
    c_max = cv2.getTrackbarPos("Canny Max", "Geometric Anomaly Scanner")
    min_length = cv2.getTrackbarPos("Min Tear Length", "Geometric Anomaly Scanner")
    
    # 1. Edge Detection
    edges = cv2.Canny(blurred, c_min, c_max)
    cv2.imshow("Geometric Anomaly Scanner", edges)
    
    # 2. Hough Line Transform (The Magic)
    # This specifically looks for straight lines (cuts) and ignores blobs (glare/hands)
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=20, minLineLength=min_length, maxLineGap=10)
    
    damage_flag = False
    
    if lines is not None:
        for line in lines:
            x1, y1, x2, y2 = line.flatten()
            
            # Calculate the angle of the line
            angle = np.abs(np.arctan2(y2 - y1, x2 - x1) * 180.0 / np.pi)
            
            # We know your cut is mostly HORIZONTAL (angle near 0 or 180)
            # If the angle is less than 30 degrees (horizontal-ish), it's the cut!
            if angle < 30 or angle > 150:
                actual_x1, actual_y1 = x1 + roi_x, y1 + roi_y
                actual_x2, actual_y2 = x2 + roi_x, y2 + roi_y
                
                # Draw the detected tear line
                cv2.line(frame, (actual_x1, actual_y1), (actual_x2, actual_y2), (0, 0, 255), 4)
                
                # Draw a bounding box around it
                min_x, max_x = min(actual_x1, actual_x2), max(actual_x1, actual_x2)
                min_y, max_y = min(actual_y1, actual_y2), max(actual_y1, actual_y2)
                cv2.rectangle(frame, (min_x-10, min_y-10), (max_x+10, max_y+10), (0, 0, 255), 2)
                
                cv2.putText(frame, "CRITICAL: LINEAR TEAR DETECTED", (min_x, min_y-20), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                damage_flag = True

    cv2.rectangle(frame, (roi_x, roi_y), (roi_x + roi_w, roi_y + roi_h), (255, 255, 0), 2)
    
    if damage_flag:
        cv2.putText(frame, "[ RUPTURE-X: STRUCTURAL TEAR ]", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 3)
    else:
        cv2.putText(frame, "[ RUPTURE-X: BELT UNIFORM ]", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    cv2.imshow("RUPTURE-X Live Inspection", frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
