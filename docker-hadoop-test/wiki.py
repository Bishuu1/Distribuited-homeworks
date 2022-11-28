import wikipediaapi

wiki_wiki = wikipediaapi.Wikipedia(language='en', extract_format=wikipediaapi.ExtractFormat.WIKI)


page_list=['Apache_Hadoop', 'Apache_Spark', 'Apache_Kafka', 'Apache_Cassandra', 'Apache_Flink', 
            'Apache_ZooKeeper', 'Apache_HBase', 'Apache_Pig', 'Apache_Mesos', 'Apache_Storm']

i=1
for page in page_list:
    if i<=5:
        file = open(str('archives/firstHalf/'+str(i)+'.txt'), 'w')
    else:
        file = open(str('archives/secondHalf/'+str(i)+'.txt'), 'w')
    
    print(i)
    page_py = wiki_wiki.page(page)
    if page_py.exists(): 
        #file.write(page_py.fullurl + '\n')
        file.write(page_py.text)#.replace("\n","<"+str(i)+">\n"))

        file.close()
        
    else:
        print("Page doesn't exist")
    i+=1