import cv2
import numpy as np

URL = "http://192.168.4.2:81/stream" 
print(f"Connecting to Edge Vision Gateway at {URL}...")

cap = cv2.VideoCapture(URL)
if not cap.isOpened():
    print("Could not connect!")
    exit()

def nothing(x):
    pass

cv2.namedWindow("Industrial AI Edge Detector")
# Canny edge detection thresholds
cv2.createTrackbar("Edge Sensitivity", "Industrial AI Edge Detector", 50, 255, nothing)
cv2.createTrackbar("Noise Filter", "Industrial AI Edge Detector", 150, 255, nothing)

print("AI Vision Engine ACTIVE! (INDUSTRIAL EDGE DETECTION MODE)")

while True:
    ret, frame = cap.read()
    if not ret:
        continue
    
    height, width, _ = frame.shape
    roi_x, roi_y = int(width * 0.2), int(height * 0.2)
    roi_w, roi_h = int(width * 0.6), int(height * 0.6)
    roi = frame[roi_y:roi_y+roi_h, roi_x:roi_x+roi_w]
    
    # Industrial technique: Look for jagged edges (tears/frays) rather than just colors
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    
    t1 = cv2.getTrackbarPos("Edge Sensitivity", "Industrial AI Edge Detector")
    t2 = cv2.getTrackbarPos("Noise Filter", "Industrial AI Edge Detector")
    
    # Canny Edge Detection
    edges = cv2.Canny(blurred, t1, t2)
    
    # Dilate edges to connect them together into a blob
    kernel = np.ones((5,5), np.uint8)
    edges_dilated = cv2.dilate(edges, kernel, iterations=2)
    
    cv2.imshow("Industrial AI Edge Detector", edges_dilated)
    
    contours, _ = cv2.findContours(edges_dilated, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    damage_flag = False
    for contour in contours:
        area = cv2.contourArea(contour)
        if area > 150: # If there is a significant cluster of edges (a tear)
            x, y, w, h = cv2.boundingRect(contour)
            actual_x = x + roi_x
            actual_y = y + roi_y
            
            cv2.rectangle(frame, (actual_x, actual_y), (actual_x + w, actual_y + h), (0, 0, 255), 2)
            cv2.putText(frame, "CRITICAL: SURFACE FRAY/TEAR", (actual_x, actual_y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
            damage_flag = True

    cv2.rectangle(frame, (roi_x, roi_y), (roi_x + roi_w, roi_y + roi_h), (0, 255, 255), 2)
    
    if damage_flag:
        cv2.putText(frame, "[ STATUS: SURFACE DEGRADATION DETECTED ]", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    else:
        cv2.putText(frame, "[ STATUS: BELT OPTIMAL ]", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    cv2.imshow("RUPTURE-X: Live Inspection", frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
