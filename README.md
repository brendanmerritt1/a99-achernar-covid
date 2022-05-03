# Team Achernar Covid-19 Dashboard

## Introduction
This covid dashboard displays covid information for the state of North Carolina, both at a state and county level. It displays data about a number of areas, including cases, deaths, hospitalizations, etc.

## Demo
To see a quick overview of the webapp with a brief explanation of each page, see the linked video here https://www.youtube.com/watch?v=CNQWKvCJ6-k. \
Additionally, this webapp is hosted on Heroku, and can be seen publicly here https://secret-ridge-44451.herokuapp.com/.

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
