#!/usr/bin/env python
# -*-coding:utf-8 -*

import wikipediaapi
wiki_wiki = wikipediaapi.Wikipedia(language='en', extract_format=wikipediaapi.ExtractFormat.WIKI)

n_of_results = 10 #Numero de resultados maximos en la busqueda.


while True:
    
    search = input('Ingrese palabra a buscar: ')
    page_list=['Apache_Hadoop', 'Apache_Spark', 'Apache_Kafka', 'Apache_Cassandra', 'Apache_Flink', 'Apache_ZooKeeper', 'Apache_HBase', 'Apache_Pig', 'Apache_Mesos', 'Apache_Storm']
    URL_list = []
    f = open("results.txt", "r")
    wcount = 0
    wpage = ''
    results = []
    for line in f:
        word, counts = line.strip().split('\t')
        if search.lower() == word.lower() :
            counts=counts.replace(')('," ").replace("(","").replace(")","").replace(', ',',').split() #1,1 9,1
            for i in counts:
                page, ncount = i.strip().split(',')
                page = int(page)
                ncount = int(ncount)
                results.append((ncount,page))

    results = sorted(results, reverse = True)       
    maximum_results = 0
    if len(results)==0:
        print('La busqueda no arrojo resultados')
    for r in results:
        c,p = r
        page_py = wiki_wiki.page(page_list[p-1])
        
        maximum_results+=1
        if maximum_results > n_of_results:
            break
        else:
            print (page_py.fullurl)




