# Bible Puzzle Project

This simple app is used to check answers to a provided puzzle. The user can visit the website and input the answers
to check that they have found the correct answer to the puzzle. 

It does not currently employ any methods to hide the answer from the user programatically, as the answer is just included
in plain text in the question object returned from the Firebase server. Improvemnts could involve storing a hashed version 
of the answer and serving this along with the question, and then using the hash function to compare the user's answers.

A plain text copy would also be stored in the firebase database and only served to admins. 

## Commands

You can replace `yarn` with `npm run` here.

```bash
# build for production
yarn build

# development mode
yarn dev

# run unit tests
yarn test

# serve the bundled dist folder in production mode
yarn serve
```

# Setting up your config

Simply replace the config in `firebaseConfig.js` with your Firebase config to host the project on your site!

I'll provide the database rules below for your conveience:

```json
{
  "rules": {
    ".read": false,
    ".write": false,
    "questions" : {
      ".read" : true,
      ".write" : "root.child('users').child(auth.uid).exists()"
    }
  }
}
```
To add admins, I simply used Firebase authentication, and then added the user's UID as a key to a read-only `users` object which Firebase can then use to verify who is an admin.

