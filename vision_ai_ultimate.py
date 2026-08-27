import cv2
import numpy as np

URL = "http://192.168.4.2:81/stream" 
cap = cv2.VideoCapture(URL)
if not cap.isOpened():
    print("Could not connect to camera!")
    exit()

def nothing(x):
    pass

cv2.namedWindow("Ultimate Anomaly Detection")
cv2.createTrackbar("Sensitivity", "Ultimate Anomaly Detection", 30, 255, nothing)
cv2.createTrackbar("Min Defect Size", "Ultimate Anomaly Detection", 200, 5000, nothing)

print("\n" + "="*50)
print("ULTIMATE ANOMALY DETECTOR INITIALIZED")
print("STEP 1: Aim camera at the smooth, HEALTHY part of the belt.")
print("STEP 2: Press 'R' on your keyboard to capture the Reference Frame.")
print("="*50 + "\n")

reference_frame = None

while True:
    ret, frame = cap.read()
    if not ret:
        continue
    
    height, width, _ = frame.shape
    roi_x, roi_y = int(width * 0.2), int(height * 0.2)
    roi_w, roi_h = int(width * 0.6), int(height * 0.6)
    roi = frame[roi_y:roi_y+roi_h, roi_x:roi_x+roi_w]
    
    gray = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
    blurred = cv2.GaussianBlur(gray, (7, 7), 0)
    
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        break
    elif key == ord('r'):
        # CAPTURE REFERENCE FRAME
        reference_frame = blurred.copy()
        print(">>> REFERENCE FRAME CAPTURED! Now scanning for anomalies... <<<")
        
    damage_flag = False
    
    if reference_frame is not None:
        # Calculate absolute difference between current frame and reference frame
        diff = cv2.absdiff(reference_frame, blurred)
        
        sensitivity = cv2.getTrackbarPos("Sensitivity", "Ultimate Anomaly Detection")
        min_size = cv2.getTrackbarPos("Min Defect Size", "Ultimate Anomaly Detection")
        
        # Threshold the difference
        _, thresh = cv2.threshold(diff, sensitivity, 255, cv2.THRESH_BINARY)
        
        # Clean up noise
        kernel = np.ones((5,5), np.uint8)
        thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
        thresh = cv2.dilate(thresh, kernel, iterations=2)
        
        cv2.imshow("Ultimate Anomaly Detection", thresh)
        
        contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
        
        for contour in contours:
            area = cv2.contourArea(contour)
            if area > min_size:
                x, y, w, h = cv2.boundingRect(contour)
                actual_x = x + roi_x
                actual_y = y + roi_y
                
                cv2.rectangle(frame, (actual_x, actual_y), (actual_x + w, actual_y + h), (0, 0, 255), 3)
                cv2.line(frame, (actual_x, actual_y), (actual_x+20, actual_y), (0,0,255), 5)
                cv2.line(frame, (actual_x, actual_y), (actual_x, actual_y+20), (0,0,255), 5)
                cv2.putText(frame, "ANOMALY DETECTED!", (actual_x, actual_y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
                damage_flag = True

    cv2.rectangle(frame, (roi_x, roi_y), (roi_x + roi_w, roi_y + roi_h), (255, 255, 0), 2)
    
    if reference_frame is None:
        cv2.putText(frame, "PRESS 'R' TO CALIBRATE HEALTHY BELT", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 165, 255), 2)
    elif damage_flag:
        cv2.putText(frame, "[ RUPTURE-X: DAMAGE DETECTED ]", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 3)
    else:
        cv2.putText(frame, "[ RUPTURE-X: SYSTEM OPTIMAL ]", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    cv2.imshow("RUPTURE-X Live Inspection", frame)

cap.release()
cv2.destroyAllWindows()
