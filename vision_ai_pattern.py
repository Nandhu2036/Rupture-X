import cv2
import numpy as np

URL = "http://192.168.4.2:81/stream" 
cap = cv2.VideoCapture(URL)

if not cap.isOpened():
    print("Could not connect to camera!")
    exit()

def nothing(x):
    pass

cv2.namedWindow("Pattern Matching Control")
cv2.createTrackbar("Match Confidence", "Pattern Matching Control", 70, 100, nothing)

template = None

print("\n" + "="*50)
print("COGNEX-STYLE PATTERN MATCHING INITIALIZED")
print("STEP 1: Move your belt so the CUT is exactly inside the small BLUE box.")
print("STEP 2: Press 'T' on your keyboard to lock onto that specific defect.")
print("="*50 + "\n")

while True:
    ret, frame = cap.read()
    if not ret:
        continue
    
    height, width, _ = frame.shape
    
    # The target box where the user must place the cut to capture the template
    box_w, box_h = 60, 40
    center_x, center_y = int(width/2), int(height/2)
    top_left = (center_x - int(box_w/2), center_y - int(box_h/2))
    bottom_right = (center_x + int(box_w/2), center_y + int(box_h/2))
    
    gray_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    
    key = cv2.waitKey(1) & 0xFF
    if key == ord('q'):
        break
    elif key == ord('t'):
        # Capture the template from the blue box
        template = gray_frame[top_left[1]:bottom_right[1], top_left[0]:bottom_right[0]]
        print(">>> DEFECT PATTERN LOCKED! Scanning... <<<")
        
    damage_flag = False
    
    if template is not None:
        # Perform pattern matching
        res = cv2.matchTemplate(gray_frame, template, cv2.TM_CCOEFF_NORMED)
        
        confidence = cv2.getTrackbarPos("Match Confidence", "Pattern Matching Control") / 100.0
        
        # Find all locations that match the template above the confidence threshold
        loc = np.where(res >= confidence)
        
        # Draw rectangles around matches
        for pt in zip(*loc[::-1]):
            cv2.rectangle(frame, pt, (pt[0] + box_w, pt[1] + box_h), (0, 0, 255), 2)
            cv2.putText(frame, "CRITICAL: DEFECT MATCH", (pt[0], pt[1]-10), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 255), 2)
            damage_flag = True
            break # Just draw the best match to avoid multiple boxes on the same spot
            
        # Show the template in the control window so you can see what it's looking for
        cv2.imshow("Pattern Matching Control", template)

    if template is None:
        # Draw the target box
        cv2.rectangle(frame, top_left, bottom_right, (255, 150, 0), 2)
        cv2.putText(frame, "PLACE CUT HERE AND PRESS 'T'", (top_left[0]-60, top_left[1]-10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 150, 0), 2)
    else:
        if damage_flag:
            cv2.putText(frame, "[ RUPTURE-X: PATTERN MATCHED ]", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 3)
        else:
            cv2.putText(frame, "[ RUPTURE-X: SYSTEM OPTIMAL ]", (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)

    cv2.imshow("RUPTURE-X Live Inspection", frame)

cap.release()
cv2.destroyAllWindows()
