# Name: Matty Vermet
# Student Number: 11320524
# Minor Programmeren, 2018

import csv
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json

# open csv input file
input = pd.read_csv('Homework/Week2/input.csv')

# fill empty cells with NaN
modified_input = input.fillna("NaN")

# extract certain columns from the data
country = modified_input.Country
region = modified_input.Region
pop_density = modified_input.Pop_Density
inf_mort = modified_input.Infant_mortality
gdp = modified_input.GDP

# create dictionary with the extracted columns
d = {'Country': country, 'Region': region, 'Population_Density': pop_density,
    'Infant_Mortality': inf_mort, 'GDP': gdp}

# store in dataframe using pandas
df = pd.DataFrame(data=d)

# create usable data, replace and remove parts of data
df['GDP'] = df.GDP.str.replace('dollars', '').astype(float)
df['Population_Density'] = df.Population_Density.str.replace(',' , '.').astype(float)
df['Infant_Mortality'] = df.Infant_Mortality.str.replace(',','.').astype(float)

# remove outliers in GDP data
dfgdp = df[((df.GDP - df.GDP.mean()) / df.GDP.std()).abs() < 3]

# calculate mean, median, mode and standard deviation of GDP
mean_gdp = df['GDP'].mean()
median_gdp = df['GDP'].median()
mode_gdp = df['GDP'].mode()
std_gdp = df['GDP'].std()

# calculate minimum, first-second-third quartile, maximum of Infant mortality
min_infm = min(df['Infant_Mortality'])
fquan_infm = df['Infant_Mortality'].quantile(q= 0.25)
median_infm = df['Infant_Mortality'].median()
tquan_infm = df['Infant_Mortality'].quantile(q=0.75)
max_infm = max(df['Infant_Mortality'])

# visualize the processed data
plt.style.use('ggplot')
f, arrax = plt.subplots(1,2)
arrax[0].hist(x= dfgdp.GDP, bins=50, rwidth=0.8)
arrax[0].set_xlabel('GDP in $')
arrax[0].set_ylabel('frequency')
arrax[0].set_title('GDP (per capita) per country', fontsize=14)
df.boxplot('Infant_Mortality')
arrax[1].set_ylabel('num. of deaths')
arrax[1].set_title('Infant mortality (per 1000 births) ', fontsize=14)

# create json output file in right format
df = df.set_index('Country')
dfjson = df.to_json(orient='index')

with open ('dfjson.json', 'w') as outfile:
    json.dump(dfjson, outfile)

if __name__ == "__main__":
    # show plot
    plt.show()
