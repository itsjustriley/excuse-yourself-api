# Excuse Yourself

## Description
Use this API to get excuses, and save them to a list. 

### How To Excuse Yourself

Send any of the following requests to https://excuse-yourself-api.onrender.com/

Note: a valid token is required to use any of the excuse-related queries. Please begin by signing up, and copy the returned token for authentication.

| Method | Endpoint | Description |
| -------- | -------- | -------- |
| POST | /signup | Sign up with a **username** and **password** to receive a token |
| POST | /login | Sign in with your **username** and **password** to receive a token |
| GET | /excuse | Displays a random excuse |
| GET | /excuse/:id | Displays a specific excuse |
| POST | /excuse/new | Add a new **excuse** |
| PUT | /excuse/:id/save | Save an excuse to your excuses |
| GET | /saved | See your saved excuses |
| DELETE | /excuse/:id/delete | Remove an excuse from your saved excuses |
| DELETE | /excuse/delete/all | Remove all excuses from your saved excuses |

### Signing Up & Logging In
Usernames must be unique.

```
{
    "username": "your_username",
    "password": "your_password",
}
```

### Adding An Excuse 

```
{
    "excuse": "your excuse"
}
```
