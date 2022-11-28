#!/usr/bin/env python
# -*-coding:utf-8 -*

import sys

current_word = None 
current_count = 0
current_file = 0
word = None

total = ''
registro=[]
file=open('/home/results.txt', 'w')
for line in sys.stdin:
    line = line.strip()
    word, count = line.split('\t',1) 
    filen, count = count.split(',', 1)
    try:
        count = int(count) 
        filen = int(filen)
    except ValueError:
        continue

    if current_word == word and current_file==filen: #none = apache, apache = kafka, kafka=apache  #MISMA PALABRA, MISMO FILE
        current_count += count 
    
    elif current_word == word and current_file!=filen: #MISMA PALABRA, NUEVO FILE
        registro.append((current_file,current_count))
        current_count = count
        current_file = filen
        
    else: #NUEVA PALABRA
        registro.append((current_file,current_count))
        registro=sorted(registro)
        if current_word:
            for h in registro:
                total+=str(h)
            print('{}\t{}'.format(current_word,total))# , apache \t 1, kafka 1 Apache (1,3)(2,3)(3,3)(4,3)
            file.write('{}\t{}'.format(current_word,total))  
        current_word = word  
        current_count = count 
        current_file = filen
        registro=[]
        total=''

if current_word == word:
    registro.append((current_file,current_count))
    registro=sorted(registro)
    for h in registro:
        total+=str(h)
    print('{}\t{}'.format(current_word,total))