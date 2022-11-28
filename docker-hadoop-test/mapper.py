#!/usr/bin/env python
# -*-coding:utf-8 -*

import sys
import re
import os
for line in sys.stdin: 
    #i = line.strip()[-2]
    i = os.environ['mapreduce_map_input_file']
    i = int(i.split("/")[-1].replace(".txt",""))
    #line=line.strip().replace("<"+str(i)+">","")
    line = re.sub(r'\W+',' ',line.strip())
    words = line.split()
    for word in words:
        print('{}\t{},{}'.format(word,i,1)) # palabra (i,1)