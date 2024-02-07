# Install Umami on Codesphere

## Links

- Blog Posts:
  - Dev.to - https://dev.to/sancho1952007/host-your-own-google-analytics-alternative-using-umami-and-codesphere-2jnk
  - Medium - https://medium.com/@sanchogodinho/host-your-own-google-analytics-alternative-using-umami-and-codesphere-2353edf3a89a

- Workspace URL: https://53867-3000.2.codesphere.com/dashboard

## Checklist
- [x] My project has been thoroughly tested and is fully functional.
- [x] The repository for my project includes a `ci.yml` file (Refer to [CodeSphere CI Pipelines](https://docs.codesphere.com/getting-started/ci-pipelines)).
- [x] The blog post about my project has been published.
- [x] All workspaces for this project are deployed on Codesphere using the CI pipeline.
- [x] My app is persistently installed in a workspace (all components are installed and configured somewhere below the `/home/user/app` path).
- [x] My pull request is well-written and clear.

This project was built as a part of Codesphere's Spring Challenge where everyone who participates wins exciting prizes.

### Motivation
Killing the dominance of big tech companies who read our user's data by switching to self-hosted Open Source alternatives like Umami.

### What I have achieved
Installing Umami, a free Open Source Analytics tool for websites on a low-cost hosting platform, Codesphere. This will keep your website analytics and user's data more secure and is completely owned by you.

## Steps for installing Umami on Codesphere.
1. Signup On Codesphere — https://codesphere.com/
2. Create a new instance using the “+ New Workspace” button.
3. Put in the URL: https://github.com/sancho1952007/install-umami-on-codesphere.git in the input box.
4. Choose the “Boost” plan at the minimum with Always On/Off or when unused based on your requirements (installation might crash on the other lower plans due to lack of resources/storage).
5. Click on the “Create button”.
6. Go to the “Setup” section on the top-left and then click on “Env vars”.
7. Click on “+ Add new variable” and then put DATABASE_URL in the left input box.
8. Enter your database MySQL / PostgreSQL Database URL (You can create one on [Codesphere](https://docs.codesphere.com/integrations/databases/) if you don’t have it) in the right side input.
9. Go to the CI Pipeline at the bottom of the screen.
10. Click on the Prepare section and then press the “Run” button.
11. My ci.yml will do all the work for you. Wait for the “Prepare” box to end. Afterward, Go to the Run section and click the “Run” button.
12. Once ✓ Ready is displayed in the terminal, click on the Open Deployment button on the top panel. Enter the default Umami credentials i.e., username: admin and password: umami

You're ready to now use it on your site!

Also, If the restart fails in the future, Follow step 9, then directly go to the Run section, and then click the "Run" button.

## Steps for adding Umami to your website.
1. Login with the credentials (if unchanged, follow step 12's credentials)
2. Click on "Settings" on the header.
3. Click on "+ Add Website".
4. Enter the name and the domain of your website example: (Example Website, example.com).
5. Click on "Save".
6. Check your website in the list and click the "Edit" button.
7. Go to the "Tracking Code" section and copy the script.
8. Paste the tracking code in the &lt;head&gt; tag of your website.
9. Go to the "Dashboard" option.

Done, this should display your Website's statistics!

Just keep in mind to change your Umami password to prevent unauthorized access to your analytics service!

Thanks for taking a look 😁
