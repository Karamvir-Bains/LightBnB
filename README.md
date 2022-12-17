# LightBNB Project
A simple multi-page Airbnb clone that uses a server-side Javascript to display the information from queries to web pages via SQL queries.

## Final Product

### Entity Relationship Diagram
!["Screenshot of LightBNB Entity Relationship Diagram"](https://github.com/Karamvir-Bains/LightBnB/blob/main/docs/LightBNB%20ERD.png)

## Getting Started

1. [Create](https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-repository-from-a-template) a new repository using this repository as a template.
2. Clone your repository onto your local device.
3. Create a PostgreSQL database called `lightbnb` and connect to it using `\c lightbnb`.
4. Run the following commands to create the database schema and seed it with fake data.
```
\i migrations/01_schema.sql
\i seeds/01_seeds.sql
\i seeds/02_seeds.sql
```
5. Inside the `LightBnB_WebApp-master` directory install the dependencies using the `npm install` command.
6. Start the web server using the `npm run local` command. The app will be served at <http://localhost:3000/>.
7. Go to <http://localhost:3000/> in your browser.

## Dependencies

- Bcrypt
- Body-parser
- Cookie-session
- Express
- Nodemon
- Pg