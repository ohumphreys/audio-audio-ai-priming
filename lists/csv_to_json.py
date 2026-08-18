import csv
import json

files = ['Counterbalance 1', 'Counterbalance 2', 'Counterbalance 3', 'Counterbalance 4', 'Identical Trials', 'Practice Trials']

for file in files:
    
    with open(f'lists/{file}.csv', newline='') as csvfile:
        data = list(csv.DictReader(csvfile))

    data = [{key.lower(): value.lower() for key, value in row.items()} for row in data]

    with open(f'lists/{file}.json', mode='w') as jsonfile:
        json.dump(data, jsonfile, indent=4)