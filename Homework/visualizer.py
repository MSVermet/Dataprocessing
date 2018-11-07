#!/usr/bin/env python
# Name: Matty Vermet
# Student number: 11320524
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# Global constants for the input file, first and last year
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# Open csv file
# For correct visualization, make sure to remove the "," from movie title 42
with open("movies.csv", 'r') as csvfile:
    movies = csv.reader(csvfile, delimiter= ',', quotechar = '|')

    # Create empty lists for each years movie ratings
    first = []
    second = []
    third = []
    fourth = []
    fifth = []
    sixth = []
    seventh = []
    eigth = []
    nineth = []
    tenth = []

    # create more empty lists to store years - ratings
    scatter_x = []
    scatter_y = []

    # extract rating of every year
    for rows in movies:
        if len(rows) > 7:
            scatter_x.append(int(rows[2]))
            scatter_y.append(float(rows[1]))

            # find matching years and store it in empty lists
            if rows[2] == '2008':
                first.append(float(rows[1]))
            if rows[2] == '2009':
                second.append(float(rows[1]))
            if rows[2] == '2010':
                third.append(float(rows[1]))
            if rows[2] == '2011':
                fourth.append(float(rows[1]))
            if rows[2] == '2012':
                fifth.append(float(rows[1]))
            if rows[2] == '2013':
                sixth.append(float(rows[1]))
            if rows[2] == '2014':
                seventh.append(float(rows[1]))
            if rows[2] == '2015':
                eigth.append(float(rows[1]))
            if rows[2] == '2016':
                nineth.append(float(rows[1]))
            if rows[2] == '2017':
                tenth.append(float(rows[1]))

# rating averages for all years
list_av = []
av2008 = list_av.append(sum(first) / len(first))
av2009 = list_av.append(round((sum(second) / len(second)), 2))
av2010 = list_av.append(round((sum(third) / len(third)), 2))
av2011 = list_av.append(round((sum(fourth) / len(fourth)), 2))
av2012 = list_av.append(round((sum(fifth) / len(fifth)), 2))
av2013 = list_av.append(round((sum(sixth) / len(sixth)), 2))
av2014 = list_av.append(round((sum(seventh) / len(seventh)), 2))
av2015 = list_av.append(round((sum(eigth) / len(eigth)), 2))
av2016 = list_av.append(round((sum(nineth) / len(nineth)), 2))
av2017 = list_av.append(round((sum(tenth) / len(tenth)), 2))

years = []
for i in range(START_YEAR, END_YEAR):
    years.append(i)

# Plot averages with matplotlib
plt.style.use('dark_background')
scatter = plt.scatter(scatter_x,scatter_y, label='all ratings')
lines = plt.plot(years, list_av, label= 'average rating')
plt.axis([2008,2017,8.0,9.6])
plt.ylabel('Average rating')
plt.xlabel('Year')
plt.title('Average rating of movies released in 2008-2017', fontsize=12, fontweight='bold')
plt.setp(scatter, color='white', alpha= 0.2)
plt.setp(lines, color='r', linewidth=1.0)
plt.legend(frameon=True)

if __name__ == "__main__":
    plt.show()
