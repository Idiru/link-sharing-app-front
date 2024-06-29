# link-sharing-app-front

## Global

### Environment variables

- `VITE_BASE_URL`: should be filled with your back-end url in order make dynamic API calls.

## SignupPage component

### Overview

The SignupPage component enables users to signup to the platform by filling all mandatories data. It features a form with username, email, password, repeat password inputs.

### Core functionalities

- <u>**Add new user:**</u> The component connects with a backend server to create a new user. .

Here is the enpoint used:

- To add a new user: `/auth/signup`

## SignupValidationPage component

### Overview

The SignupPageValidation page is just here for UX. It allows the user to know that his account creation worked

### Core functionalities

- <u>**Confetti:**</u> Tons of conffeti are falling to celebrate properly this account creation.

2 parameters are handling this effect:

- `recycle={false}`: Avoid to repeat indefinitely the effect. They fall only once.
- `numberOfPieces={3000}`: Define the number of confetti. It can impact the performances.

Here is the enpoint used:

- To add a new user: `/auth/signup`

## LoginPage component

### Overview

The LoginPage component enables users to log into their accounts by entering their credentials. It features a form for email and password input, handles user authentication via an API, and manages navigation based on the authentication state.

### Core functionalities

- <u>**Authentication Handling:**</u> The component connects with a backend server to verify user credentials and retrieve a token upon successful login.

Here is the enpoint used:

- To login: `/auth/login`

Then the JWT token is stored inside the local storage to allow the user to access to private pages.

## Update User Page Form

### Overview

The UpdateUserPage component allows users to update their profile information. It features a form for updating the username, first name, last name, email, current password, new password, repeated password, and profile image.

### Core functionalities

<u>Fetch User Data:</u> Retrieves the current user data from the backend and populates the form fields.
<u>Update User Profile:</u> Allows users to update their profile information and submit it to the backend server.
Here are the steps and API calls used:

<u>Fetching User Data:</u> Upon mounting, the component fetches the user data using the endpoint:
GET: /auth/users/${id} 
<u>Updating User Data:</u> On submitting the form, it sends the updated data to the backend:
PUT: /auth/update/${id}

Initialization involves fetching current user data from the backend, ensuring the form is initially populated with the user's existing information.

Form Handling employs the useReducer hook to manage the state of form fields, ensuring controlled input handling and synchronization with UI updates.

File Upload functionality manages the selection and preview of profile images, enabling users to upload new images and view them before submission.

Data Submission occurs when users finalize their updates. It involves packaging form data, including any newly uploaded profile images, into a FormData object. This object is then sent to the backend server via a PUT request to update the user's profile using the appropriate endpoint. This comprehensive approach ensures seamless interaction between the frontend and backend systems, maintaining user data integrity and enhancing user experience.

## BuilderPage component

### Overview

The BuilderPage component is part of the application that allows users to manage links and content dynamically. It integrates various features such as adding new links, updating, and removing existing ones. This component utilizes React hooks for state management and interacts with a backend via axios for data persistence.

### Core functionalities

- <u>**Add new Links:**</u> Users can add new links through a dedicated button which instantiates a new link object. This link is initially marked as 'new', allowing the system to distinguish unsaved changes.

- <u>**Edit links:**</u> Each link can be edited directly from the interface. Changes to the link’s platform, title, or URL are tracked instantaneously, updating the state of the link to 'updated' unless it is a newly added link, which retains the 'new' state until saved.

- <u>**Remove links:**</u> Links can be removed by marking them as 'deleted' within the internal state. This does not immediately remove the link from the visible list but excludes it from being saved or manipulated further.

The whole content is store inside the state variable `content`, the key state allows us to know that should be done later when you click on the Save button.

After clicking on the Save button, the link to the back-end is done thanks to the `handleSave`function which will do the right API call (POST, PUT or DELETE) for each content item according to the state (exemple: if state = new then POST request).

The link to the user is made directly by the back-end thanks to the JWT token.

Here are the enpoints used:

- To create a new content: `/content/create`
- To update and delete a content (PUT request for the first one and DELETE for the second one): `/content/${item._id}`

## Preview Page component

### Overview

The PreviewPage component allows users to preview the content they have built. It displays the user profile and the content links, providing an option to share the profile link.

### Core functionalities

- <u>**Fetch User Data:**</u>Retrieves the current user data from the backend and populates the preview fields.
- <u>**Fetch User Content:**</u>Retrieves the user's content from the backend and displays it.
- <u>**Share Link:**</u>Allows users to generate and share a link to their profile, opening a modal with the shareable link.
- <u>**Redirect to Links:**</u> Users can click on content items to be redirected to the respective URLs.

Here are the steps and API calls used:
<u>Fetching User Data:</u> Upon mounting, the component fetches the user data using the endpoint: GET: /auth/users/${id}
<u>Fetching User Content:</u> Upon mounting, the component fetches the user content using the endpoint: GET: /content/users/${id}
<u>Sharing the Profile Link:</u> Generates a shareable link using the endpoint: PUT: /content/users/${id}/publish

Initialization involves fetching current user data and content from the backend, ensuring the preview page is populated with the user's existing information. The component uses useState to manage the user data and content, and useEffect to trigger data fetching on component mount. The handleShareLink function publishes the user's content and generates a shareable link, which is then displayed in a modal. The handleRedirection function manages redirection to the URLs associated with the content items.

## VIsitors Page component

### Overview

The VisitorsPage component allows external users to view the profile and content of a specific user. It displays the user profile and the content links, similar to the PreviewPage but intended for public viewing.

### Core functionalities
<u>Fetch User Data:</u> Retrieves the current user data from the backend and populates the visitor view.
<u>Fetch User Content:</u> Retrieves the user's content from the backend and displays it.
<u>Redirect to Links:</u> Users can click on content items to be redirected to the respective URLs.

Here are the steps and API calls used:

<u>Fetching User Data:</u> Upon mounting, the component fetches the user data using the endpoint: GET: /user/devlinks/{userName}
<u>Fetching User Content:</u> Upon mounting, the component fetches the user content using the same endpoint and extracts the content from the response.

Initialization involves fetching current user data and content from the backend, ensuring the visitor page is populated with the user's existing information. The component uses useState to manage the user data and content, and useEffect to trigger data fetching on component mount. The handleRedirection function manages redirection to the URLs associated with the content items.
