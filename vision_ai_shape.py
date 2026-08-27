import cv2
import numpy as np

URL = "http://192.168.4.2:81/stream" 
cap = cv2.VideoCapture(URL)
if not cap.isOpened():
    print("Could not connect to camera!")
    exit()

def nothing(x):
    pass

cv2.namedWindow("Structural Shape Analyzer")
cv2.createTrackbar("Brightness Threshold", "Structural Shape Analyzer", 180, 255, nothing)
cv2.createTrackbar("Min Aspect Ratio", "Structural Shape Analyzer", 30, 100, nothing) # 30 means 3.0 ratio (long & thin)
cv2.createTrackbar("Min Size", "Structural Shape Analyzer", 50, 2000, nothing)

print("\n" + "="*50)
print("STRUCTURAL SHAPE ANALYZER ACTIVE")
print("Filtering out glare/blobs using Aspect Ratio mathematics...")
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
    
    thresh_val = cv2.getTrackbarPos("Brightness Threshold", "Structural Shape Analyzer")
    min_ratio = cv2.getTrackbarPos("Min Aspect Ratio", "Structural Shape Analyzer") / 10.0
    min_size = cv2.getTrackbarPos("Min Size", "Structural Shape Analyzer")
    
    # 1. Isolate bright spots (your white cut + glare)
    _, thresh = cv2.threshold(blurred, thresh_val, 255, cv2.THRESH_BINARY)
    
    # Clean noise
    kernel = np.ones((3,3), np.uint8)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    
    cv2.imshow("Structural Shape Analyzer", thresh)
    
    contours, _ = cv2.findContours(thresh, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)
    
    damage_flag = False
    
    for contour in contours:
        area = cv2.contourArea(contour)
        if area > min_size:
            # 2. ASPECT RATIO MATH using minAreaRect (Handles Diagonal Cuts!)
            rect = cv2.minAreaRect(contour)
            (center_x, center_y), (w, h), angle = rect
            
            # Avoid division by zero
            if w == 0 or h == 0:
                continue
                
            aspect_ratio = max(w, h) / min(w, h)
            
            # If the shape is long and thin (Ratio > min_ratio)
            if aspect_ratio > min_ratio:
                # Get the 4 corners of the rotated box
                box = cv2.boxPoints(rect)
                box = np.int32(box)
                
                # Shift box to actual screen coordinates
                for pt in box:
                    pt[0] += roi_x
                    pt[1] += roi_y
                
                # Draw high-tech rotated bounding box
                cv2.drawContours(frame, [box], 0, (0, 0, 255), 3)
                
                # Find top-left-most point for text
                text_x = min(box[:, 0])
                text_y = min(box[:, 1])
                
                # Tag it
                cv2.putText(frame, f"TEAR (RATIO: {aspect_ratio:.1f})", (text_x, text_y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
                damage_flag = True

    cv2.rectangle(frame, (roi_x, roi_y), (roi_x + roi_w, roi_y + roi_h), (255, 255, 0), 2)
    
    if damage_flag:
        cv2.putText(frame, "[ RUPTURE-X: LONGITUDINAL TEAR DETECTED ]", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 3)
    else:
        cv2.putText(frame, "[ RUPTURE-X: SURFACE UNIFORM ]", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    cv2.imshow("RUPTURE-X Live Inspection", frame)
    
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

cap.release()
cv2.destroyAllWindows()
