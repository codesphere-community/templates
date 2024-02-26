## Umami vs Posthog vs Google Analytics Feature Comparison

| **Feature**             | **Umami**                                | **Posthog**                                          | **Google Analytics**                                |
|-------------------------|------------------------------------------|------------------------------------------------------|-----------------------------------------------------|
| Self-hosted             | ✔ Yes                                    | ❌ No (Cloud-based)                                   | ❌ No (Cloud-based)                                  |
| Open Source             | ✔ Yes                                    | ✔ Yes                                                | ❌ No                                                |
| User-Friendly Interface | ✔ Yes                                    | ✔ Intuitive UX                                       | ❌ Can be complex for beginners                      |
| Real-time Data          | ✔ Yes                                    | ✔ Real-time event tracking                           | ❌ Delayed data updates (not real-time)              |
| Extensive Features      | ❌ Limited                               | ✔ Feature-rich                                       | ✔ Wide range of features and reporting options     |
| Integration Options     | ❌ Few                                   | ✔ Broad integrations                                 | ✔ Seamless integration with Google products        |
| Data Privacy            | ✔ Full control over data                  | ✔ Emphasis on data privacy                           | ❌ Hosted on Google servers, potential privacy concerns |
| Large User Base         | ✔ Vast user community on Github            | ❌ Smaller Community Than Others                                  | ✔ Vast user community and extensive documentation  |
| Own Server Setup            | ✔ Required if self-hosting               | ✔ Required if self-hosting                          | ❌ Not applicable (cloud-based)                      |
| Learning Curve          | ✔ Easy to set up                          | ✔ Straightforward setup process                      | ✔ Easy to set up                                    |
| Ecosystem               | ❌ Limited                               | ❌ Developing ecosystem                               | ✔ Part of the Google Marketing Platform              |

*Note: Tick marks (✔) indicate the presence of the feature, while crosses (❌) indicate the absence or limitations in that aspect.*

## Steps for installing Umami on Codesphere.

1. Signup On https://codesphere.com/
2. Create a new instance using the “+ New Workspace” button.
3. Put in the URL: [https://github.com/codesphere-community/Umami](https://github.com/codesphere-community/Umami) in the input box.
4. Choose the “Boost” plan at the minimum with Always On/Off or when unused based on your requirements (installation might crash on the other lower plans due to lack of resources/storage).
5. Click on the “Create button”.
6. Go to the “Setup” section on the top-left and then click on “Env vars”.
7. Click on “+ Add new variable” and then put DATABASE_URL in the left input box.
8. Enter your database MySQL / PostgreSQL Database URL (You can create one on [Codesphere](https://docs.codesphere.com/integrations/databases/) if you don’t have it) in the right side input.
9. Go to the CI Pipeline at the bottom of the screen.
10. Click on the Prepare section and then press the “Run” button.
11. Wait for the “Prepare” box to end. Afterward, Go to the Run section and click the “Run” button.
12. Once ✓ Ready is displayed in the terminal, click on the Open Deployment button on the top panel. Enter the default Umami credentials i.e., username: admin and password: umami

You're ready to now use it on your site!

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



