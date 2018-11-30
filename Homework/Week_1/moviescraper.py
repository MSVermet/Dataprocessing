#!/usr/bin/env python
# Name: Matty Vermet
# Student number: 11320524
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup
import codecs

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature&release_date=2008-01-01,2018-01-01&num_votes=5000,&sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # load html file
    html_file = open('movies.html', "r")
    page = BeautifulSoup(html_file.read())

    # Extract movie titles, store in empty list
    titles = []
    all_titles = iter(page.find_all('img'))
    next(all_titles)
    next(all_titles)
    for movie_title in all_titles:
        titles.append(movie_title.get('alt'))

    # Extract movie ratings, store in empty list
    ratings = []
    all_ratings = iter(page.find_all('div'))
    for rating in all_ratings:
        if rating.get('data-value') != None:
            ratings.append(float(rating.get('data-value')))

    # Extract year of release
    years = []
    release_year = []
    all_releases = page.find_all('span', attrs={'class':'lister-item-year'})
    for release in all_releases:
        for c in release.get_text():

            # Ensure only the digits are stored in list
            if c.isdigit():
                years.append(c)

    # Combine the digits of the years
    for i in range(0, len(years), 4):
        release_year.append(int(years[i] + years[i+1] + years[i+2] + years[i+3]))

    # Extract actors and actresses
    total_actors = []
    actors_movie = []

    all_actors = page.find_all('a')
    for actor in all_actors:
        if "adv_li_st_" in actor.get('href'):
            actors_movie.append(actor.get_text())

    # Combine actors for each movie together in a list
    for i in range(0, len(actors_movie), 4):
        total_actors.append([actors_movie[i], actors_movie[i+1], actors_movie[i+2] ,actors_movie[i+3]])

    # Insert None for movie with no actors provided
    total_actors.insert(42, [None])

    # Extract runtime number, store in list
    runtimes = []
    all_runtimes = page.find_all('span', attrs={'class':'runtime'})
    for runtime in all_runtimes:
        if " " in runtime.get_text():
            splitted = runtime.get_text().split(" ")
            runtimes.append(int(splitted[0]))

    # Put all parts of movies together
    help_list = [titles, ratings, release_year, total_actors, runtimes]
    all_movies = []
    for i in range(0, 49):
        all_movies.append([part[i] for part in help_list])

    return all_movies

def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    # with open('movies.csv', 'w') as outfile:
    writer = csv.writer(outfile, delimiter=',' , quotechar=' ')
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])
    writer.writerows(movies)

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'.format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
