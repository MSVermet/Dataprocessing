# Convert txt file to json
import json
import csv

# open txtfile, add fieldnames, convert to json
filename = open('Homework/Week3/KNMI_20181101.txt', 'r')
file = csv.DictReader(filename, fieldnames = ("Station", "Date", "Windspeed", "Temperature", "Sunhours", "Precipitation", "Cloudness"))
out = json.dumps([row for row in file])

# create output file
with open('Homework/Week3/weather_data.json', 'w') as outfile:
    outfile.write(out)
