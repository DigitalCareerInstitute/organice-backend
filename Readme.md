# Native Friends (Backend side)

## Installation

1.  Download the repository as .zip-file or clone it.
2.  Run `npm install` in your terminal to get all needed packages.
3.  Copy **the variables.env.sample** file to **variables.env**.
4.  Edit the configuration to fit your setup and needs.
5.  Run `node app.js` ,or through **NODEMON** `nodemon app.js`

## Routing

### Registrations and login routes

localhost:8080/api/users/register (post)

localhost:8080/api/users/login (post)

localhost:8080/api/users/reset (post)

#### Protected Routes (returns "yes" if token is valid )

localhost:8080/api/users/delete (delete)

localhost:8080/api/users/edit (post)

----------------------------------------

localhost:8080/api/scans/new  (create)

localhost:8080/api/scans/edit 

localhost:8080/api/scans/delete

localhost:8080/api/scans/

localhost:8080/api/scans/:id/

----------------------------------------

localhost:8080/api/categories/new  (create)

localhost:8080/api/categories/edit  (edit categories)

localhost:8080/api/categories/delete

localhost:8080/api/categories/

localhost:8080/api/categories/:id/
