# Convert txt file to json
import json
import csv

# open txtfile, add fieldnames, convert to json
filename = open('DataHappyPlanet.csv', 'r')
file = csv.DictReader(filename, fieldnames = ("Ranking","Country","Region","Average_life_exp", "Average_wellbeing", "Footprint", "Inequality_of_outcomes", "HappyPlanetIndex"))
out = json.dumps([row for row in file])

# create output file
with open('HappyPlanet.json', 'w') as outfile:
    outfile.write(out)
