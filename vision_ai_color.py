import cv2
import numpy as np

URL = "http://192.168.4.2:81/stream" 
print(f"Connecting to Edge Vision Gateway at {URL}...")

cap = cv2.VideoCapture(URL)
if not cap.isOpened():
    print("Could not connect to camera stream! Make sure you are connected to SmartBelt_AI WiFi.")
    exit()

def nothing(x):
    pass

cv2.namedWindow("AI Calibration Panel")
# Hue ranges from 0 to 179 in OpenCV
cv2.createTrackbar("Color Hue", "AI Calibration Panel", 110, 179, nothing) # Default 110 is Blue
cv2.createTrackbar("Hue Tolerance", "AI Calibration Panel", 20, 50, nothing)
cv2.createTrackbar("Min Size", "AI Calibration Panel", 100, 5000, nothing)
cv2.createTrackbar("Max Size", "AI Calibration Panel", 4000, 20000, nothing)

print("AI Vision Engine ACTIVE! (COLOR MODE)")

while True:
    ret, frame = cap.read()
    if not ret:
        continue
    
    height, width, _ = frame.shape
    
    # 1. CREATE AN INSPECTION ZONE (ROI)
    roi_x, roi_y = int(width * 0.2), int(height * 0.2)
    roi_w, roi_h = int(width * 0.6), int(height * 0.6)
    roi = frame[roi_y:roi_y+roi_h, roi_x:roi_x+roi_w]
    
    blurred = cv2.GaussianBlur(roi, (5, 5), 0)
    
    # Convert to HSV color space (Much better for eliminating shadows/glares)
    hsv = cv2.cvtColor(blurred, cv2.COLOR_BGR2HSV)
    
    target_hue = cv2.getTrackbarPos("Color Hue", "AI Calibration Panel")
    tolerance = cv2.getTrackbarPos("Hue Tolerance", "AI Calibration Panel")
    min_size = cv2.getTrackbarPos("Min Size", "AI Calibration Panel")
    max_size = cv2.getTrackbarPos("Max Size", "AI Calibration Panel")
    
    # Define color range
    lower_bound = np.array([max(0, target_hue - tolerance), 100, 50])
    upper_bound = np.array([min(179, target_hue + tolerance), 255, 255])
    
    mask = cv2.inRange(hsv, lower_bound, upper_bound)
    
    kernel = np.ones((5,5), np.uint8)
    mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN, kernel)
    
    cv2.imshow("AI Calibration Panel", mask)
    
    contours, _ = cv2.findContours(mask, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    damage_flag = False
    for contour in contours:
        area = cv2.contourArea(contour)
        if min_size < area < max_size: 
            x, y, w, h = cv2.boundingRect(contour)
            
            actual_x = x + roi_x
            actual_y = y + roi_y
            
            cv2.rectangle(frame, (actual_x, actual_y), (actual_x + w, actual_y + h), (0, 0, 255), 2)
            cv2.line(frame, (actual_x, actual_y), (actual_x+15, actual_y), (0,0,255), 4)
            cv2.line(frame, (actual_x, actual_y), (actual_x, actual_y+15), (0,0,255), 4)
            cv2.putText(frame, "CRITICAL: DEFECT DETECTED", (actual_x, actual_y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
            damage_flag = True

    cv2.rectangle(frame, (roi_x, roi_y), (roi_x + roi_w, roi_y + roi_h), (0, 255, 255), 2)
    cv2.putText(frame, "INSPECTION ZONE", (roi_x, roi_y - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 255, 255), 1)

    cv2.putText(frame, "RUPTURE-X: COLOR VISION ENGINE", (10, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 204), 2)
    if damage_flag:
        cv2.putText(frame, "[ STATUS: DAMAGE DETECTED ]", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    else:
        cv2.putText(frame, "[ STATUS: BELT OPTIMAL ]", (10, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

    cv2.imshow("RUPTURE-X: Live Inspection", frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
