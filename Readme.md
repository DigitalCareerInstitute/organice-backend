# Native Friends (Backend side)

## Installation

1.  Download the repository as .zip-file or clone it.
2.  Run `npm install` in your terminal to get all needed packages.
3.  Copy **the .env.sample** file to **.env**.
4.  Edit the configuration to fit your setup and needs.
5.  Run `node app.js` ,or through **NODEMON** `nodemon app.js`

## Routing

### Registrations, login and user routes

#### Register

`POST` localhost:8080/api/register

`curl -X POST http://localhost:8080/api/register -H "Content-Type: application/json" -d '{"name": "tommyA", "email": "tommy@example.com","password":"password123"}'`

#### Login

`POST` localhost:8080/api/login

`curl -X POST http://localhost:8080/api/login -H "Content-Type: application/json" -d '{"email": "tommy@example.com","password":"password123"}'`

### Protected Routes (Only valid with token)

#### User

`POST` localhost:8080/api/users/update (edit)

`POST` localhost:8080/api/users/updatepassword

`POST` localhost:8080/api/users/logout

`POST` localhost:8080/api/users/delete

---

#### Scans

`GET` localhost:8080/api/scans/ (get all scans)

`curl http://localhost:8080/api/scans -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidG9tbXkiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWQiOiI1YjU2ZGQ5NjUyOWVmMDY5MjFlZTdhYWMiLCJpYXQiOjE1MzI0MTk0NzksImV4cCI6MTUzMjU5MjI3OX0.Tzwe-BQ6qv3u06gYc8q2Su3rMcg_MFC0-8-n3JUG1_c'`

`GET` localhost:8080/api/scans/:id (get single scan)

`POST` localhost:8080/api/scans/add

`curl -X POST http://localhost:8080/api/scans/add -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidG9tbXkiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWQiOiI1YjU2ZGQ5NjUyOWVmMDY5MjFlZTdhYWMiLCJpYXQiOjE1MzI0MTk0NzksImV4cCI6MTUzMjU5MjI3OX0.Tzwe-BQ6qv3u06gYc8q2Su3rMcg_MFC0-8-n3JUG1_c' -H 'Content-Type: application/json' -d '{"category": "finance", "title": "IHK", "image": "https://www.w3schools.com/w3css/img_lights.jpg", "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore", "date": "1544832000"}'`

`POST` localhost:8080/api/scans/:id/udpate

`POST` localhost:8080/api/scans/:id/delete

`POST` localhost:8080/api/scans/delete

`curl -X POST http://localhost:8080/api/scans/delete -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidG9tbXkiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWQiOiI1YjU2ZGQ5NjUyOWVmMDY5MjFlZTdhYWMiLCJpYXQiOjE1MzI0MTk0NzksImV4cCI6MTUzMjU5MjI3OX0.Tzwe-BQ6qv3u06gYc8q2Su3rMcg_MFC0-8-n3JUG1_c' -H 'Content-Type: application/json' -H "id: 5b56e19a80f548787dec0ba8"`

---

#### Categories

`POST` localhost:8080/api/categories/

`POST` localhost:8080/api/categories/add (create)

`POST` localhost:8080/api/categories/:id/update

`POST` localhost:8080/api/categories/:id/delete

### Development testing routes

`POST` localhost:8080/api/users/deleteAll (delete) delete all users

`POST` localhost:8080/api/scans/deleteAll (delete) delete all scans

`POST` localhost:8080/api/categories/deleteAll (delete) delete all categories
