# Workplace Analyzer AI System

## Project Overview

The Workplace Analyzer AI is a full-stack web application designed to analyze images from workplace environments. Its primary function is to detect individuals within a scene, count them, and analyze their facial expressions to determine the overall mood of the group. This system leverages advanced computer vision models for detection and recognition, wrapped in a modern, responsive user interface.

## Technology Stack

This project is built using a decoupled client-server architecture.

### Backend (Server)
The backend is responsible for all image processing, machine learning inference, and API handling.

*   **Language**: Python 3.10+
*   **Framework**: Flask (Micro-web framework)
*   **Computer Vision & AI**:
    *   **Ultralytics YOLOv8**: Utilized for state-of-the-art object detection (specifically person detection).
    *   **DeepFace**: A hybrid framework used for facial attribute analysis (emotion detection) and face detection fallback.
    *   **RetinaFace**: An optional high-precision face detector available within the system.
    *   **OpenCV**: Used for image manipulation and legacy Haar Cascade detection.
*   **Utilities**: NumPy for matrix operations.

### Frontend (Client)
The frontend provides a futuristic, interactive user interface for uploading images and visualizing results.

*   **Framework**: Next.js 15+ (React framework) with App Router.
*   **Language**: TypeScript.
*   **Styling**: Tailwind CSS for utility-first styling.
*   **Animations**: Framer Motion for complex layout transitions and scanning effects.
*   **Icons**: Lucide React.
*   **Theme**: Custom Cyberpunk/Dark mode implementation with glassmorphism effects.

## Prerequisites

Before running this application, ensure you have the following installed on your machine:

1.  **Python**: Version 3.9 or higher.
2.  **Node.js**: Version 18 or higher (LTS recommended).
3.  **npm**: Node Package Manager (usually installs with Node.js).

## Installation and Setup Guide

Follow these steps to set up the project locally.

### 1. Clone the Repository
Download or clone this project to your local machine.

### 2. Backend Setup
Navigate to the server directory and install the required Python dependencies.

```bash
cd server
pip install -r requirements.txt
```

**Note**: On the first run, the system may download several hundred megabytes of model weights (YOLOv8n, RetinaFace, etc.). Ensure you have a stable internet connection.

### 3. Frontend Setup
Navigate to the client directory and install the Node.js dependencies.

```bash
cd ../client
npm install
```

## Running the Application

You need to run both the backend and frontend servers simultaneously. Open two separate terminal windows.

### Terminal 1: Start the Backend
```bash
cd server
python app.py
```
You should see output indicating the Flask server is running on `http://0.0.0.0:5000`.

### Terminal 2: Start the Frontend
```bash
cd client
npm run dev
```
The Next.js development server will start, typically on `http://localhost:3000`.

## Usage Instructions

1.  Open your web browser and navigate to `http://localhost:3000`.
2.  You will be presented with a futuristic dashboard.
3.  **Select a Model**: Use the dropdown menu to choose your detection engine:
    *   **RetinaFace**: Highest accuracy for face detection. Best for clear shots of faces.
    *   **YOLOv8**: Best overall balance. Detects full bodies and is less likely to miss people looking away.
    *   **SSD**: Faster, lighter model.
    *   **OpenCV**: Legacy method (fastest, but lowest accuracy).
4.  **Upload Image**: Drag and drop an image or click the scan area to select a file (JPG or PNG).
5.  **View Results**: The system will process the image. A "Live Feed" view will appear with bounding boxes around detected individuals and their mood labels. A statistical summary will appear on the right side.

## Troubleshooting

*   **Port Conflicts**: If the server fails to start, ensure ports 5000 and 3000 are not in use. You can use `netstat` or Task Manager to check and kill conflicting processes.
*   **Model Errors**: If YOLO fails (`multiprocessing` error or similar), try restarting the server. If DeepFace fails to download weights, manually delete the `~/.deepface` directory and retry.
*   **UI Issues**: If the UI looks broken, ensure you ran `npm install` after the latest changes to install `framer-motion` and `lucide-react`.

## Reusability and Customization

This project is designed to be modular.

*   **Adding New Models**: You can extend `cv_utils.py` in the server directory. Add your new model logic inside `analyze_image_cv` and map a new key from the frontend dropdown.
*   **Adjusting Confidence**: In `cv_utils.py`, look for the `conf=0.4` parameter in the YOLO section or `min_neighbors` in OpenCV to adjust sensitivity.
*   **Theming**: The futuristic theme is defined in `client/app/globals.css`. You can change the CSS variables (`--primary`, `--background`) to re-skin the application.
