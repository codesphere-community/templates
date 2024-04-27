# What is File Converter?
File Converter is a ready-to-deploy web application which takes takes file input, converts images, and extracts audio from video. For front-end it uses Vanilla HTML, styled with CSS and Integrates the backend and other functionalities using JavaScript. For backend, it leverages Python and FastAPI program hosted on a uvicorn server.

# Features
- **Ready-to-Deploy:** Can login to Codesphere and select this template to deploy it with ease.
- **Wide range of image support:** For both image input as well as supported output, it is compatible with the following audio types: BMP, GIF, ICO, JPEG, PNG, PPM, TIFF, WEBP, PDF.
- **Wide range of video support:** It supports the following video input: MP4, AVI, MOV, MKV, WMV, FLV and following audio output: MP3, FLAC.
- **Compact and Robust:** It is a web-application built primarily to fulfill its purpose of being a resilient and functional file converter. It uses JavaScript to cleverly handle the component behavior to avoid awkward user experience.
- **Strong file detection:** It does not depend on the file extension to recognize the file type but instead identifies it directly from the buffer to avoid invalid files and support more files.
- **Fun styling and interactive elements:** It uses simple CSS styling to provide a cursor trailing effect as well as clickable title (toggles different effects upon click).

# Prerequisites
To follow along this blog post, all you need is a Codesphere Account which you can create by visiting ![here](https://codesphere.com/ide/signin).

# Deployment
1. Click ![here](https://codesphere.com/ide/signin) to visit the Codesphere sign-in page and login using your preferred authentication.

![Codesphere Sign-in Page](Readme/1-Sign-In-Page.webp?raw=true)


2. Here click on New Workspace to create a workspace where you will import this template.

![Codesphere Workspace Page](Readme/2-Workspace-Page.webp?raw=true)


3. Select your desired configuration. Recommended is to select “Always on” in the Deployment mode to have your web application running always.

![Workspace configuration](Readme/3-Workspace-Configuration.webp?raw=true)


4. After creating your workspace, it will lead you to the Codesphere IDE. Tap on the “Pipeline” tab at the bottom of the IDE beside the Terminal tab.

![Codesphere IDE](Readme/4-Codesphere-IDE.webp?raw=true)


5. This will open the panel where you can execute the commands stored in the CI.yml file. Tap on the Run button in the Prepare section to install the required dependencies.

![CI Pipeline Prepare Section](Readme/5-CI-Prepare-Section.webp?raw=true)


6. You will see a green highlight on Prepare section if successful. Now Tap on Run section and click the Run button since there are no Test steps for this template.

![CI Pipeline Run Section](Readme/6-CI-Run-Section.webp?raw=true)


7. After tapping the Run button, you will see that the web server boots up indicating that the web application has been deployed. You can tap on the “Open deployment” button at the top right to visit your web application.

![CI Pipeline successful run](Readme/7-CI-Successful-Run.webp?raw=true)


8. That’s it! You just deployed your File Converter web application in quick and easy steps using Codesphere. Now you can share the application URL with your friends and peers for them to use it as well!

![File Converter Web Application](Readme/8-File-Converter-Web-Application.webp?raw=true)

# Conclusion
With Codesphere, you can create templates such as the File Converter which we used in this one and have them ready-to-deploy without much hassle.