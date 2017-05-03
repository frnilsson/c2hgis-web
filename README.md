Connect2HealthFCC
======
The **Connect2HealthFCC** Task Force’s Mapping Broadband Health in America tool allows users to visualize, overlay and analyze broadband and health data at the national, state and county levels – informing policy prescriptions and investment decisions.

The maps are an interactive experience, showing various pictures of the intersection between connectivity and health for every county in the United States. Users can generate customized maps that show broadband access, adoption and speed alongside various health measures (e.g., obesity, diabetes and physician access) in urban and rural areas.

These maps can be used by both public and private sectors, and local communities, to identify opportunities and gaps in connected care. 

### Screenshot
![Alt text](/img/screenshot-home.png?raw=true "FCC Connect2Health")

## Data sources
The broadband data is current as of December 2014 and comes from the Commission’s Form 477 data on residential fixed broadband deployment and residential fixed broadband subscribership. Proportions for broadband access statistics are calculated using 2014 demographic data from GeoLytics, E. Brunswick, NJ. The health data is drawn from the 2015 release of the Robert Wood Johnson Foundation County Health Rankings & Roadmap (which reflects data from the Health Resources and Services Administration, Dartmouth Atlas Project, American Medical Association, Centers for Disease Control and Prevention and other primary sources); and additional demographic data is from the U.S. Census Bureau. Learn more about the data[] and methodology. 

## Running the Site Locally
To run the site locally on your own computer (most helpful for previewing your own changes), you will need to install a local server like [http-server](https://www.npmjs.com/package/http-server) or [xampp](https://www.apachefriends.org/index.html):

1. If you don't already have Ruby and Bundler installed, follow [the first two steps in these Jekyll installation instructions](https://help.github.com/articles/using-jekyll-with-pages#installing-jekyll "Installation instructions for Jekyll").
2. Next, [fork this repository](https://help.github.com/articles/fork-a-repo/ "Instructions for Forking Your Repository") and clone it on your computer.
3. The client side files are located in the `client` folder.

To run the site locally, start the local server, then visit `http://localhost:8080/client/index.html` in your browser to preview the site. You may need to change the port number depending on how your local server is setup.

## Download 
* [Version 1.0.0](https://github.com/FCC/c2hgis-web/archive/v1.0.0.zip)

## Contact
* e-mail: engagec2h@fcc.gov