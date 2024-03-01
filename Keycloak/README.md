# Keycloak - configuring for production on Codesphere

## What Is Keycloak?
Keycloak is an open-source identity and access management solution that provides robust authentication and authorization services for web and mobile applications. Developed by Red Hat, Keycloak simplifies the implementation of security features by offering a centralized and customizable authentication server. It supports various authentication protocols, including OpenID Connect, OAuth 2.0, and SAML, allowing developers to integrate single sign-on (SSO) capabilities seamlessly. Keycloak's versatile features include user federation, role-based access control, and social identity provider integration, enabling organizations to secure their applications with ease. Its user-friendly administration console facilitates the management of users, groups, and client applications, making it a popular choice for enterprises seeking a comprehensive identity management solution.

## Prerequisites
For following along with this tutorial-like blog post you need to have these things before diving in with us.

- Codesphere Account
- PostgreSQL Database (can be purchased from Codesphere)

## Getting a database from Codesphere.
- Go to https://codesphere.com/ide/menu/services
![db (2)](https://github.com/sancho1952007/templates/assets/73981314/52218ea4-a5b8-48e4-8d1f-62a5a7b1ea20)
- In the databases section, click on the "Create" button.
![image](https://github.com/sancho1952007/templates/assets/73981314/aaac0c17-0d33-4b0a-8777-fa3384777fa8)
- Select PostgreSQL from the dropdown of the available databases.
![image](https://github.com/sancho1952007/templates/assets/73981314/fc87e032-0fb7-4f0f-bb23-ef184169ead4)
- Click on the "Create" button once you have chosen your preferred plan (minimum plan required: Free).
![image](https://github.com/sancho1952007/templates/assets/73981314/9ff84fc7-7555-4c29-b5e4-c191c17b9d6c)
- Wait for the "Actions" tab to show the text, "Show info". This may take a while.
- Click on the "Show info" button and copy the "Connection String". This is the database URL you will need in the further steps.
![image](https://github.com/sancho1952007/templates/assets/73981314/e8244595-ada2-4c76-97b9-5c316cc36b53)

## Installing Keycloak On Codesphere.
- Navigate to Codesphere's workspaces page.
![image](https://github.com/sancho1952007/templates/assets/73981314/d0742822-1e63-4fa2-aa2d-3d24db250a42)
- Click on the "New Workspace" button.
![image](https://github.com/sancho1952007/templates/assets/73981314/f046f8c8-280b-4cee-bbda-2ada00fd3d25)
- Create a new workspace with the GitHub URL: https://github.com/codesphere-community/Keycloak
![image](https://github.com/sancho1952007/templates/assets/73981314/faaf6bda-8fcf-4f1d-8e72-0ee499b7f542)
- Click on the "Create" button after choosing your preferred settings.
![image](https://github.com/sancho1952007/templates/assets/73981314/da75d0b5-c935-40f2-a694-ddcf101847e1)
- Head over to the "Setup" section of the IDE.
![image](https://github.com/sancho1952007/templates/assets/73981314/ce506093-5ec2-46cd-a2ab-7c63b1b8e221)
- Click on "Env vars" in the list.
![image](https://github.com/sancho1952007/templates/assets/73981314/e7d1ace5-03dc-4253-851a-c2db079b6613)
- Click on the "Add new variable" option to add a variable.
![image](https://github.com/sancho1952007/templates/assets/73981314/1e4bdd0c-932e-4ec0-8e48-8aab642a99fd)
- Add the variables:
   - DATABASE_URL (The database URL).
   - KEYCLOAK_ADMIN (The admin username).
   - KEYCLOAK_ADMIN_PASSWORD (The admin password).
     ![image](https://github.com/sancho1952007/templates/assets/73981314/6e1421d5-2f2f-4425-bfb1-e8506896ae89)
- Click on the "CI Pipeline" button at the bottom of the page.
![image](https://github.com/sancho1952007/templates/assets/73981314/d179a907-bd95-49fb-891a-73caad3bb9fc)
- Click on the "Run" button to run the installation script. Go to the next step only after the "Prepare" button on the left panel turn Green in colour.
![image](https://github.com/sancho1952007/templates/assets/73981314/39f5e634-0191-4d66-9778-f4360c929128)
- Click on the "Run" button on the left panel.
![image](https://github.com/sancho1952007/templates/assets/73981314/036b5d96-e510-411b-8c88-1144244ba702)
- Click on the smaller "Run" button on the right panel.
![image](https://github.com/sancho1952007/templates/assets/73981314/bd957656-6675-46b4-b832-e83b583f6d8f)
- If this is the first time installation, wait for about 1 minute before continuing to the next step this is because it's running the build script and then starting the server. After the first time, it would start in under 15 seconds.
- Click on the "Open Deployment" button on the top panel of the page.
![image](https://github.com/sancho1952007/templates/assets/73981314/34f732a7-1758-4663-903e-2974107dd559)
- After Keycloak opens, click on the "Administration Console" button.
![image](https://github.com/sancho1952007/templates/assets/73981314/600c6f4d-112b-4077-9a8f-d9271dc6f968)
- Log in with your environment variables KEYCLOAK_ADMIN (username) and KEYCLOAK_ADMIN_PASSWORD (password)
![image](https://github.com/sancho1952007/templates/assets/73981314/c793e8c6-2e05-4022-ab5f-e802f78fc32f)
Congratulations, You have successfully set up Keycloak on Codesphere 🎉

## Updating
Go to the "CI Pipelines" and then run the "Prepare" CI command. This will automatically delete the old version and update it to the latest version.
Stop (if needed) and then Re-Run the "Run" CI command to restart it.

## More customization
You can find more customization options here: https://www.keycloak.org/server/all-config
Go to the "Define CI Pipelines" and edit the start script as per your requirements.
You may need to restart the start CI command in order to see the changes.
