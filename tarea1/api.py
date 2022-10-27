from distutils.log import error
from urllib.parse import urlencode
import requests
import csv
from bs4 import BeautifulSoup
import re
import pandas as pd
import time
from unicodedata import name
import psycopg2

conexion = psycopg2.connect(
    host="localhost",
    database="root",
    user="root")

cursor = conexion.cursor()

cursor.execute("CREATE TABLE IF NOT EXISTS dburl (id serial PRIMARY KEY, anonID INT, title text, description text, keywords text, url text)")

conexion.commit()

start = time.time()



listing =  open('user-ct-test-collection-02.txt', "r") 

lines = listing.readlines()

#findings = re.findall(r'http[s]?:\/\/.*\b',contents)
#listing = pd.read_csv('user-ct-test-collection-02.txt')
#x = re.search("/^(http|https)\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,6}(/\S*)?$/gm",listing)
crawlerFile = open("crawler.csv", 'w')
failedFile = open("Failedcrawler.csv", 'w')
f = csv.writer(crawlerFile)
f2 = csv.writer(failedFile)
f.writerow(['anonID', 'title', 'description', 'keywords', 'URL'])

nsites = 0



for line in lines:

    line = line.strip().split("\t")

    

    anonID, maybeURL = line[0], line[-1]

    actualURL= re.search(r'http[s]?:\/\/.*\b',maybeURL)

    print(maybeURL)

    if actualURL:
        
        
        try: 
            
            page = requests.get(maybeURL)

            soup = BeautifulSoup(page.text, 'html.parser')
            title = soup.find('title').text
            descriptions = soup.find("head").find("meta",{"name" : "description"})['content']
            keywords = soup.find("head").find("meta", {"name" : "keywords"})['content']
            #blockquote_items = soup.find_all('')

            #for blockquote in blockquote_items:
            #try :    
                #title = soup.find('title').text
            
            #except:
                #title = "N/A"
                
            #try :
                #descriptions = soup.find("meta", property ='og:description')['content']

            
            #except:
                #try:
                    #descriptions = soup.find("meta", name ='description')["content"]
                    

                #except:
                    #descriptions = "N/A"
            
            #try:

                #keywords = soup.find("meta", property = 'og:keywords')["content"]

            #except:

                #try:    
                    #keywords = soup.find("meta", property = 'keywords')["content"]
                    
                #except:

                    #keywords = "N/A"    
            #frase = blockquote.find('q').text
                
            f.writerow([anonID, title, descriptions, keywords, maybeURL])
            print ('todo bien')
        except:
            f2.writerow([NameError, maybeURL])
            print ('except')
        else:
            cursor.execute("INSERT INTO dburl (anonID, title, description, keywords, url) VALUES (%s, %s, %s, %s, %s)", (anonID, title, descriptions, keywords, maybeURL))
            
    nsites += 1
    
<<<<<<< HEAD
    if nsites >= 50 :
=======
    if nsites >= 20:
>>>>>>> 4ac790235b6dec72e85935908d3a863664af8831
        break
conexion.commit()
conexion.close()
listing.close()
end = time.time()
print(end-start)
crawlerFile.close()
failedFile.close()