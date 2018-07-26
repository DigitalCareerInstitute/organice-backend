# Native Friends (Backend side)

## Installation

1.  Download the repository as .zip-file or clone it.
2.  Run `npm install` in your terminal to get all needed packages.
3.  Copy **the variables.env.sample** file to **variables.env**.
4.  Edit the configuration to fit your setup and needs.
5.  Run `node index.js` ,or through **NODEMON** `nodemon index.js`

## Routing

### Registrations and login routes

`POST` localhost:8080/api/users/register 

`curl -X POST http://localhost:8080/api/register -H "Content-Type: application/json" -d '{"name": "tommyA", "email": "tommy@example.com","password":"password123"}'`

`POST` localhost:8080/api/users/login 
curl -X POST http://localhost:8080/api/login -H "Content-Type: application/json" -d '{"email": "tommy@example.com","password":"password123"}'` 

`POST` localhost:8080/api/users/reset/:id 
### Protected Routes (returns "yes" if token is valid )

localhost:8080/api/users/delete/:id (delete)

`POST` localhost:8080/api/users/edit/:id 
ocalhost:8080/api/users/delete (delete) delete all users

---

#### Scans

`POST` localhost:8080/api/scans/new

`POST` localhost:8080/api/scans/edit/:id

`POST` localhost:8080/api/scans/delete

`curl -X POST http://localhost:8080/api/scans/delete -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidG9tbXkiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWQiOiI1YjU2ZGQ5NjUyOWVmMDY5MjFlZTdhYWMiLCJpYXQiOjE1MzI0MTk0NzksImV4cCI6MTUzMjU5MjI3OX0.Tzwe-BQ6qv3u06gYc8q2Su3rMcg_MFC0-8-n3JUG1_c' -H 'Content-Type: application/json' -H "id: 5b56e19a80f548787dec0ba8"`

`GET` localhost:8080/api/scans/


`curl  http://localhost:8080/api/scans -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidG9tbXkiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWQiOiI1YjU2ZGQ5NjUyOWVmMDY5MjFlZTdhYWMiLCJpYXQiOjE1MzI0MTk0NzksImV4cCI6MTUzMjU5MjI3OX0.Tzwe-BQ6qv3u06gYc8q2Su3rMcg_MFC0-8-n3JUG1_c'`

`GET` localhost:8080/api/scans/:id/


`curl -X POST http://localhost:8080/api/scans/add -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1lIjoidG9tbXkiLCJlbWFpbCI6ImFkbWluQGV4YW1wbGUuY29tIiwiaWQiOiI1YjU2ZGQ5NjUyOWVmMDY5MjFlZTdhYWMiLCJpYXQiOjE1MzI0MTk0NzksImV4cCI6MTUzMjU5MjI3OX0.Tzwe-BQ6qv3u06gYc8q2Su3rMcg_MFC0-8-n3JUG1_c' -H 'Content-Type: application/json' -d '{"category": "finance", "title": "IHK", "image": "https://www.w3schools.com/w3css/img_lights.jpg", "content": "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore", "date": "1544832000"}'`

---

#### Categories

localhost:8080/api/categories/new (create)

localhost:8080/api/categories/edit (edit categories)

localhost:8080/api/categories/delete

localhost:8080/api/categories/

localhost:8080/api/categories/:id/
