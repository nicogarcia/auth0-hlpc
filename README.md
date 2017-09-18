# Hosted Login Page Configurator
Enables Auth0 customers to customize their Hosted Login Page with just a few clicks.

Live demo: [HLP Configurator](https://auth0-hlpc.firebaseapp.com) (works with fixed credentials of a test account)

## Use case
  1) Open the [demo](https://auth0-hlpc.firebaseapp.com)
  1) Read the explanation of the purpose of the site that has just opened
  1) Click continue
  1) See the title "Custom Login Page preview", the **Edit** and **Open live version** buttons beside it and the login page preview in almost full screen.
  1) Click Edit.
  1) In the sidebar that has just appeared see the **Properties** and **Html** tabs, and a select box showing options: **Global settings**(selected) and **Log In Screen**
  1) Click the color button in the **Primary color** setting
  1) See the color picker
  1) Pick red color in the color picker
  1) See the autosave feedback label with text **Saving...** first and then **Saved!** under the **Primary color** setting and see the color change in the login page
  1) Click **Html** tab
  1) In the code editor that has just appeared, add your site's header code and click save button located above the editor
  1) See the header in the login page preview
  1) Click **Open live version**
  1) Change to the new tab
  1) See the real Custom Login Page
  
  **Note:** As being considered a bad practice, no work was made on a step asking the customer for his client credentials, although this was part of the initial excercise commitment:
  > 4) Click continue
  > 1) Read the reasons to insert client credentials (client_id/client_secret) in the shown form
  > 1) Fill client_id
  > 1) Fill client_secret

## How it works
This application has a backend made with Express that runs on Webtask and a frontend made with React mostly following the Auth0 Styleguide.
The customization is worked out by putting a placeholder in the default html code and sending it to the UI together with the default custom configuration. The UI shows this code and configuration and updates and sends them in case of user interaction. Then the backend serializes the configuration into a Base64 encoded string, inserts that in the early mentioned placeholder and send it to Auth0 through the Management API. When the frontend receives the successful response, it reloads the preview that displays the real login screen.

## Known issues
- There's only one setting to customize (widget's primary color).
  
  **Reason:** This is part of the narrowing of the excercise to fit the time constraints.
  
  **Note:** There are many settings that are not currently available in Auth0 Lock as a config option.
  
  **Solution:** Maybe the best solution for this is to wait for the options to be added, otherwise, another way could be overriding of the Lock's css classes.
- No customer authentication is being made.

  **Reason:** At first, it was decided to use fixed credentials to avoid dealing early with the authentication mechanisms, then it was assumed as a commitment to ask the customer for the credentials and use them from the backend, but that idea was discarded to avoid spending time in developing a feature that's against security principles like not sharing id tokens. Instead, it was tried to add a consent screen for the user to give authorization to the application, but given the lack of understanding of the process, redirection technical issues and lack of documentation, that feature couldn't be worked out in time.
  
  **Solution:** Get help to solve the redirection problems and make sure this process is valid, otherwise, get help to solve extension code not updating in dashboard after reinstalling.
- Code editor doesn't fill its parent

  **Reason:** It couldn't be made the proper styling to solve that issue.
  
  **Solution:** Get help from a designer.
- Code and can't be reset to initial value.

  **Reason:** Feature didn't fit in time constraints.
  
  **Solution:** Create and endpoint and return already existing default html code and settings, add a reset button to both html and settings tab with a reset confirm dialog.
  
- Backend is not caching neither global client id nor access tokens.

  **Reason:** Feature didn't fit in time constraints.
  
  **Solution:** Add temporary caching of to reduce Management API calls and make preview reloading faster.
