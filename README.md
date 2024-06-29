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

