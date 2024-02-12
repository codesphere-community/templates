# Install Umami on Codesphere
Hey folks,  
So, have you ever wondered whether you can host your own Google Analytics alternative (because Google collects a lot of data from it)?

If yes, you’re on the very correct repository!

Let’s dive into how we can deploy our own Analytics service using Codesphere Cloud!

## First of all, why Umami?
Umami emerges as an appealing option for website analytics due to its self-hosted, open-source design, granting website admins complete control over their user's data and privacy. Now bring that with Codesphere, a secure and dependable hosting platform, and you get a seamless experience. Codsphere provides a sturdy server infrastructure, streamlining Umami's setup process and making it user-friendly, even for those lacking technical expertise. With Codsphere's hosting, users enjoy consistent performance, security, and a supportive environment for running Umami Analytics. This capability of Umami's features and Codsphere's hosting capabilities establish a potent and accessible solution for the best web analytics experience.

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

If you're convinced to use Umami with significant advantages over traditional analytics tools like Google Analytics or Posthog, see below the steps for installing it!

## Steps for installing Umami on Codesphere.
1. Signup On Codesphere — https://codesphere.com/
2. Create a new instance using the “+ New Workspace” button.
3. Put in the URL: [https://github.com/codesphere-community/Umami](https://github.com/codesphere-community/Umami) in the input box.
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

Here's the tutorial if you help with the installation: https://www.youtube.com/watch?v=DpkkjibjPpo

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


## A/B testing with Codesphere & Umami.
A/B testing is a statistical method used in marketing and product development to compare two versions, A and B, of a webpage, email, or other content to determine which performs better. The goal is to identify changes that positively impact user engagement, conversion rates, or other key metrics. Randomly assigned groups of users are exposed to either version, and their behavior is analyzed to assess the effectiveness of each variant. By isolating variables and measuring outcomes, A/B testing helps businesses make data-driven decisions, optimize user experiences, and refine strategies for optimal performance in areas such as website design, marketing campaigns, and product features.

Let's see how to do this using Codesphere's advanced functionalities!
1. Create 2 workspaces for your A/B testing instances.
2. Copy and paste the tracking code in the &lt;head&gt; tag of the website paths that you want to be tracked.
3. Create a &lt;script&gt; tag.
4. Inside the created &lt;script&gt; tag, put the code: umami.track('Website &lt;A/B&gt;');  
Change the A/B based on which instance you're on or put any value that differentiates between the two websites. In my case, I put 'A/B 1' and 'A/B 2'.
5. Go to the domain section in Codesphere and [register your domain](https://docs.codesphere.com/getting-started/custom-domains).
6. Select the two A/B workspaces that you want to test on that domain from the "Workspaces" dropdown. This will now automatically display the two versions of your website.
7. To view your results, go to the Umami dashboard, click on "View Details →" and scroll to the bottom.
8. Your events should be displayed in the events section.
   ![image](https://github.com/sancho1952007/templates/assets/73981314/3da24d97-7a02-4474-8522-d919dc449664)


Thanks for taking a look 😁
