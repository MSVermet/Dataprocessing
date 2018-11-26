# Convert txt file to json
import json
import csv
import pandas as pd

forest = pd.read_csv('Homework/Week4/ForestAreaData.csv', sep = ' , ', error_bad_lines=False, engine='python')
World = forest.iloc[[4]]

#forest = forest.set_index('Country')
print(forest.to_json(orient= 'index'))
forest_json = forest.to_json(orient= 'index')

with open('ForestArea.json', 'w') as outfile:
    json.dump(forest_json, outfile)
