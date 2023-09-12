# Team Achernar Covid-19 Dashboard

## Introduction
This COVID-19 dashboard displays COVID-19 information for the state of North Carolina, both at a state and county level. It displays data about a number of areas, including cases, deaths, hospitalizations, etc. It has pages for vaccine and outbreak info, containing a variety of tables and graph. There are also registration and login components to personalize the "My County" page, and the account information can be edited/deleted at any time. \
\
The dashboard is rendered on the frontend through React, while the endpoints and server-side logic in the backend is managed by Express. It uses better-sqlite3 (a SQLite derivative) to manage a database with a number of tables, holding COVID-19 data, account info, and access logs. API endpoints managed by the Express router contain filtered json data from the database, which is served to the frontend with Axios. As of now, data is parsed from a CSV file into the database, but since this takes a significant amount of time on the first start, the SQLite database is included in the repository. Data from the News tab is pulled from the Bing News Search API with the query "Coronavirus".

## Demo
To see a quick overview of the webapp with a brief explanation of each page, see the linked video here https://www.youtube.com/watch?v=CNQWKvCJ6-k. \
Additionally, this webapp is hosted on my personal domain, and can be seen publicly here https://covid.brendanmerritt.com/.

## Installation and Run Instructions
1. Navigate to a directory of your choosing and clone this directory with `git clone `.\
2. In order to install the appropriate packages with npm, run the command `npm i` in the root directory.\
3. (Option 1): To run both the front-end webpage and back-end api together in a development build, run `npm run dev`.
4. (Option 2): Instead of running the webapp in a development build, the Heroku URL can be visited above to see a production build of the project.

### Dev Instructions
To create a production build of the project, run `npm run build`.\
To run only the front-end, run `npm run client`.\
To run only the back-end, run `npm run start`.

## API Endpoints Documentation
Full API Documentation can be found under `/docs` directory. 

## Team Information
This Covid Dashboard is implemented by Team Achernar from COMP 426, Spring 2022. Team details can be found under `/docs/plan.txt`.

## Data Source
The data used to implement this dashboard is from North Carolina Department of Health and Human Services(NCDHHS), Link to data: https://covid19.ncdhhs.gov/dashboard/data-behind-dashboards
