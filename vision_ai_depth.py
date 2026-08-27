import cv2
import numpy as np

URL = "http://192.168.4.2:81/stream" 
cap = cv2.VideoCapture(URL)

if not cap.isOpened():
    print("Could not connect to camera!")
    exit()

def nothing(x):
    pass

cv2.namedWindow("Topographic Depth Scanner")
cv2.createTrackbar("Depth Threshold", "Topographic Depth Scanner", 200, 255, nothing)

print("\n" + "="*50)
print("PSEUDO-DEPTH TOPOGRAPHIC SCANNER")
print("Visualizing surface intensity as a 3D depth map...")
print("="*50 + "\n")

while True:
    ret, frame = cap.read()
    if not ret:
        continue
    
    height, width, _ = frame.shape
    roi_x, roi_y = int(width * 0.2), int(height * 0.2)
    roi_w, roi_h = int(width * 0.6), int(height * 0.6)
    roi = frame[roi_y:roi_y+roi_h, roi_x:roi_x+roi_w]
    
    # Convert to grayscale
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    
    # Apply a colormap to simulate a depth/thermal camera (JET map)
    # This turns pixel intensity into a color spectrum (Blue=Low, Red=High/Bright)
    depth_map = cv2.applyColorMap(gray, cv2.COLORMAP_JET)
    
    # Get threshold for "Anomaly Depth"
    thresh_val = cv2.getTrackbarPos("Depth Threshold", "Topographic Depth Scanner")
    
    # Threshold the grayscale to find the extreme peaks (the white cut)
    _, thresh = cv2.threshold(gray, thresh_val, 255, cv2.THRESH_BINARY)
    
    contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    damage_flag = False
    for contour in contours:
        area = cv2.contourArea(contour)
        if 50 < area < 3000: # Filter noise
            x, y, w, h = cv2.boundingRect(contour)
            
            # Draw on the depth map
            cv2.rectangle(depth_map, (x, y), (x+w, y+h), (255, 255, 255), 2)
            
            # Draw on the main frame
            actual_x = x + roi_x
            actual_y = y + roi_y
            cv2.rectangle(frame, (actual_x, actual_y), (actual_x + w, actual_y + h), (0, 0, 255), 2)
            cv2.putText(frame, "ELEVATION ANOMALY", (actual_x, actual_y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
            damage_flag = True

    # Show the "Depth Sensor" view
    cv2.imshow("Topographic Depth Scanner", depth_map)
    
    cv2.rectangle(frame, (roi_x, roi_y), (roi_x + roi_w, roi_y + roi_h), (255, 255, 0), 2)
    
    if damage_flag:
        cv2.putText(frame, "[ RUPTURE-X: SURFACE DEFORMATION ]", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 3)
    else:
        cv2.putText(frame, "[ RUPTURE-X: SURFACE UNIFORM ]", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    cv2.imshow("RUPTURE-X Live Inspection", frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
