# 🧠 Hybrid Exam Monitoring System

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript)
![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?style=for-the-badge&logo=tensorflow)
![Responsive](https://img.shields.io/badge/Responsive-Design-00bcd4?style=for-the-badge&logo=responsive-design)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

---

## 🎯 Overview

**Hybrid Exam Monitoring** is a real-time proctoring system that leverages machine learning and browser-native tools to detect suspicious activity during online exams. It uses **TensorFlow.js (COCO-SSD model)** to detect objects like people and cell phones and monitors activity directly from the user's webcam.

The system logs alerts, displays live stats, and provides a dual theme toggle, all without requiring backend servers or external installations.

---

## ✨ Features

- 🧑‍💻 Detects **people** and **cell phones** in real-time using the webcam.
- 📱 Flags **phones** confidently (score > 70%) and raises alerts.
- 👥 Detects **background persons** by bounding box size and motion.
- ⏱️ Real-time **exam duration timer**.
- 📋 Visual **log of alerts** (phones, multiple persons, etc.).
- 📊 Displays **camera frame count**, **people**, and **phones detected**.
- 🌗 **Light/Dark mode** toggle for user preference.
- ⚡ Fast, efficient, and built with **TensorFlow.js (COCO-SSD)** and **OpenCV-style drawing**.

---

## 📸 Screenshots

> Home Interface | Dark Mode | Phone & Person Detection  
> ![UI](screenshots/ui.png) ![Dark](screenshots/dark.png) ![Detection](screenshots/detection.png)

---

## 🎞️ Demo GIF

![Demo](demo/hybrid-monitoring-demo.gif)

> 🎮 [Live Demo on Netlify](https://procx.netlify.app/)

---

## 🛠️ Tech Stack

| Layer       | Technology                      |
|------------|----------------------------------|
| Frontend   | HTML5, CSS3, JavaScript (ES6)    |
| AI Model   | TensorFlow.js with COCO-SSD      |
| Rendering  | `<canvas>` API                   |
| UX Theme   | CSS Variables + JS Toggle        |
| Hosting    | Netlify / GitHub Pages (optional) |

---

## 🧪 How It Works

1. **Start Exam** initializes the webcam and loads the object detection model.
2. Every frame is analyzed:
   - People detection tracks multiple humans.
   - Smaller bounding boxes = background people.
   - Phone detection uses confidence thresholds.
3. **Canvas** overlays bounding boxes with labels.
4. Alerts and logs appear in real-time.


---

## 🚀 Future Enhancements

- 🧠 Add face recognition with MediaPipe for identity tracking.
- 🖥️ Support screen sharing detection (via browser APIs).
- 📤 Export alert logs as a CSV file.
- ⏹️ Auto-stop exam on repeated violations.
- 🔒 Add facial landmark detection for mouth/eye tracking.

---

## 🧾 License

This project is licensed under the **MIT License**.

---

## 🙏 Acknowledgements

- [TensorFlow.js](https://www.tensorflow.org/js) — Client-side ML inference
- [COCO-SSD Model](https://github.com/tensorflow/tfjs-models/tree/master/coco-ssd)
- [Netlify](https://netlify.com) — Easy free deployment

---

## ✨ Author

**Sagnik Patra**
**Annan Sadr**
**Rashi Pandey**
**Ankush Kumar Ramteke**  


> Built to bring trust and integrity into online exams.  
