from flask import Flask,request,render_template,request,Response,jsonify
from application.utils.convs_handler import ConvHandler
import json

pipeline_path = './pipeline.json'

with open(pipeline_path, 'r') as file:
    pipeline_dict = json.load(file)

convs_dict = {
    #format---> ip:{ 
    #               convId:{
    #                   messages = [],
    #               }
    #               ...
    #               metadata (a list containing all convId and title in dict format) = [
    #                       {
    #                           "convID",
    #                           "convTitle"
    #                       }...]
    #                  
}

convHandler = ConvHandler(convs_dict=convs_dict)
