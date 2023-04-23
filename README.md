# Credential Manager Frontend Application

An React.js web application that is designed to interact with the Credential Manager API which interfaces with a MongoDB database that stores information about users and their organisational units and divisions that they have access to. The user can register and/or login, and view and manipulate registered user details as well as account credential information that resides within their assigned organisational units and divisions.

---

## Table of Contents

1. How to install the project
2. How to use the project
3. Credit to authors

---

## How to install the project

Before you get to use the project, you need to install all the necessary software on your local machine. As mentioned in the description, this is a React.js web application, and thus, you will have to install Node.js and NPM (Node Package Manager) in order you to run the React.js application on your machine. You will not need to install Node.js and NPM separately, since NPM is automatically installed once you install Node.js. Note that this application was built using Node.js version 16.17.0 and NPM version 9.4.2. However, it is generally recommended that you install the latest LTS (Long-Term Support) version of Node.js and NPM, as it is unlikely that any newer versions of Node and NPM will be unable to run this server. You can download Node.js and NPM [here](https://nodejs.org/en/download). To ensure that you have successfully installed Node.js and NPM, open up a CLI (Command Line Interface) and run the following commands:

- node -v
- npm -v

This should return the version numbers for Node.js and NPM installed on your local machine. For example, 'node -v' might return something like v16.17.0, and 'npm -v' might return something like v9.4.2.

Once Node.js and NPM are installed, ensure that you have downloaded all the project files and directories and saved them in a location that you will easily remember. Now, open up a CLI and navigate to the project's root directory. Once there, you will have to install all the necessary libraries for this server to run. To do this, simply type in the following command:

- npm install

This should create a 'node_modules' directory in the project's root directory where all the required libraries will be installed. You are now ready to run and test this web application.

---

## How to use the project

To use this web application, you will first need to ensure that the Credential Manager Backend API is running on your localhost machine. To learn how to get this server running, check the README.md file for the Credential Manager Backend API.

Once you have the server running on your local machine, open up a CLI (Command Line Interface) and navigate to the root directory of the project. In there, simply type in the following command to run the web application on your browser:

- npm start

Once the application has loaded, you should see the homepage of the application in your browser. If the CLI is currently running the application, but the application is not open in your browser, simply navigate to the following address in your browser to view the homepage:

- 'http://localhost:3000/'

The Credential Manager application makes use of all the functionalities of the Credential Manager API. All of these functionalities include:

- Register
- Login
- Account
- View Users
- Assign Division
- Unassign Division
- Change/Update Role
- View Credentials
- Add Credential
- Update Credential

Once the web application has loaded the homepage, you will already see two of the available functionalities, 'Login' and 'Register', in the navigation menu in the top right corner of the page.

### Register

If you navigate to 'Register', you will see the username, password and confirm password fields. Simply enter the details for the new user account, and click on the 'Register' button. This will add a new user to the database.

### Login

If you navigate to 'Login', you will see the username and password fields. Simply enter the details of the user account you wish to login with, and click on the 'Login' button. This will authenticate you and allow you to access the rest of the page's resources.

### Account

Once you are logged in, you will have the ability to navigate to 'Account'. Here, you will be able to view your own account details. These details include your username, role and assigned organisational units and divisions.

### View Users

Once you are logged in, you will have the ability to navigate to 'View Users'. Here, you will be able to view an entire list of users currently registered with the Credential Manager application. From here, you will be able to navigate to 'Assign Division', 'Unassign Division' or 'Change Role' for any particular user of your choosing. The 'View Users' page also contains a 'Refresh Users' button that will display the most recent details for all users.

### Assign Division

If you navigate to 'Assign Division', you will be given the option to choose a specific organisational unit and division that you would like to add/assign your selected user to. Once you have selected an organisational unit and division, simply click on the 'Assign Division' button to assign your selected user to your chosen organisational unit and division. Note that if you are logged in as a user whose role is not an 'admin' role, then you will not be able to assign any users to an organisational unit and division.

### Unassign Division

If you navigate to 'Unassign Division', you will be given the option to choose a specific organisational unit and division that you would like to remove/unassign your selected user from. Once you have selected an organisational unit and division, simply click on the 'Unassign Division' button to unassign your selected user from your chosen organisational unit and division. Note that if you are logged in as a user whose role is not an 'admin' role, then you will not be able to unassign any users from an organisational unit and division.

### Change Role

If you navigate to 'Change Role', you will be given the option to choose a specific role that you would like to assign to your selected user. You will be given three options, and each of these roles have their own set of abilities. These roles are:

- normal:
  - The user has the ability to add credentials to an organisational unit and division that they are assigned to.

- management:
  - The user has the ability to update any credential in an organisational unit and division that they are assigned to.
  - The user also has the same ability as the normal user role.

- admin:
  - The user has the ability to assign any user to an organisational unit and division that they themselves are assigned to.
  - The user has the ability to unassign any user from an organisational unit and division that they themselves are assigned to.
  - The user has the ability to change any other user's role.
  - The user also has the same abilities as the normal and management user roles.

### View Credentials

Once you are logged in, you will have the ability to navigate to 'View Credentials'. Here, you will be able to view an entire list of account credentials for the organisational units and divisions that you are currently assigned to. From here, you will be able to navigate to 'Update Credential' for any particular account credential of your choosing. The 'View Credentials' page also contains a 'Refresh Credentials' button that will display the most recent details for all account credentials available to you.

### Add Credential

Once you are logged in, you will have the ability to navigate to 'Add Credential'. Here, you will be able to select an organisational unit and division that you are assigned to, and you will be able to enter the details (account name, username and password) for the new account credential that you would like to add to your selected organisational unit and division. Once you have chosen your organisational unit and division, and you have entered your details, you may click on the 'Add Credential' button to confirm your addition. Note that any registered user with any of the three valid roles (normal, management and admin) can perform this function.

### Update Credential

If you navigate to 'Update Credential', you will be given opportunity to enter the new details for your selected credential. Here, you may enter a new account name, username and/or password. If you wish to only update one or two of these details instead of all of them, simply enter the details only for the fields that you wish to update, and leave the rest of the fields blank. However, if you would like to update all the details, then simply enter the new details in all fields. Once you have entered all your details, you may click on the 'Update Credential' button to confirm your changes. Note that if you are logged in as a user whose role is not a 'management' or 'admin' role, then you will not be able to update any credentials.

---

## Credit to authors

[Dean Justin Gulston](https://github.com/DJGulston)
