# Convert txt file to json
import json
import csv

# open txtfile, add fieldnames, convert to json
filename = open('KNMI_20181101.txt', 'r')
file = csv.DictReader(filename, fieldnames = ("Station", "Date", "Windspeed", "Temperature", "Sunhours", "Precipitation", "Cloudness"))
out = json.dumps([row for row in file])

# create output file
with open('weather_data.json', 'w') as outfile:
    outfile.write(out)
