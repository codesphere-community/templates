![Template Banner](pdf-server.webp?raw=true)

## What is File Converter?
It is a robust, locally hosted web-based PDF manipulation tool using Docker. It enables you to carry out various operations on PDF files, including splitting, merging, converting, reorganizing, adding images, rotating, compressing, and more. Originally developed entirely by ChatGPT, this locally hosted web application has evolved to encompass a comprehensive set of features, addressing all your PDF requirements.

Stirling PDF does not initiate any outbound calls for record-keeping or tracking purposes.

All files and PDFs exist either exclusively on the client side, reside in server memory only during task execution, or temporarily reside in a file solely for the execution of the task. Any file downloaded by the user will have been deleted from the server by that point.

For more features and details, can refer to their GitHub: https://github.com/Stirling-Tools/Stirling-PDF.

## Prerequisites
To follow along this blog post, all you need is a Codesphere Account which you can create by visiting [here](https://codesphere.com/ide/signin).

## Deployment
1. Click ![here](https://codesphere.com/ide/signin) to visit the Codesphere sign-in page and login using your preferred authentication.

![Codesphere Sign-in Page](https://github.com/codesphere-community/templates/blob/main/pdf-server/readme/1-Signin-Page.JPG?raw=true)


2. Here click on New Workspace to create a workspace where you will import this template.

![Codesphere Workspace Page](https://github.com/codesphere-community/templates/blob/main/pdf-server/readme/)2-Workspace-Page.JPG?raw=true)


3. Put https://github.com/Stirling-Tools/Stirling-PDF as the repository link and select your desired configuration. Recommended is to select “Always on” in the Deployment mode to have your web application running always.

![Workspace configuration](https://github.com/codesphere-community/templates/blob/main/pdf-server/readme/3-Workspace-Config.JPG?raw=true)


4. After creating your workspace, it will lead you to the Codesphere IDE. Tap on the “Pipeline” tab at the bottom of the IDE beside the Terminal tab.

![Codesphere IDE](https://github.com/codesphere-community/templates/blob/main/pdf-server/readme/4-Codesphere-IDE.JPG?raw=true)


5. This will open the panel where you can execute the commands stored in the CI.yml file. Tap on the Run button in the Prepare section to install the required dependencies.

![CI Pipeline Prepare Section](https://github.com/codesphere-community/templates/blob/main/pdf-server/readme/5-CI-Prepare-Section.JPG?raw=true)


6. You will see a green highlight on Prepare section if successful. Now Tap on Run section and click the Run button since there are no Test steps for this template.

![CI Pipeline Run Section](https://github.com/codesphere-community/templates/blob/main/pdf-server/readme/6-CI-Run-Section.JPG?raw=true)


7. After tapping the Run button, you will see that the web server boots up indicating that the web application has been deployed. You can tap on the “Open deployment” button at the top right to visit your web application.

![CI Pipeline successful run](https://github.com/codesphere-community/templates/blob/main/pdf-server/readme/7-CI-Successful-Run.JPG?raw=true)


8. That’s it! You just deployed your Stirling-PDF web application in quick and easy steps using Codesphere. Now you can share the application URL with your friends and peers for them to use it as well!

![File Converter Web Application](https://github.com/codesphere-community/templates/blob/main/pdf-server/readme/8-Stirling-PDF.JPG?raw=true)

## Conclusion
With Codesphere, you can create templates such as the PDF Service (Sterling-PDF) which we used in this one and have them ready-to-deploy without much hassle.
