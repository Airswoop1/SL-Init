import csv
from fdfgen import forge_fdf
import os
import sys, getopt

sys.path.insert(0, os.getcwd())
filename_prefix = "SNAPplication_"
csv_file = "NVC.csv"
pdf_file = "NVC.pdf"
tmp_file = "tmp.fdf"
output_folder = './output/'

def process_csv(file):
    headers = []
    data =  []
    csv_data = csv.reader(open(file,"rU"), dialect=csv.excel_tab)

    for i, row in enumerate(csv_data):
      row = row[0].split(',')
      if i == 0:
        headers = row
        print headers
        continue;
      field = []
      for i in range(len(headers)):
        field.append((headers[i], row[i]))
      data.append(field)
    return data


def form_fill(fields):
    fdf = forge_fdf("",fields,[],[],[])
    fdf_file = open(tmp_file,"w")
    fdf_file.write(fdf)
    fdf_file.close()
    output_file = '{0}{1} {2}.pdf'.format(output_folder, filename_prefix, fields[0][1])
    cmd = 'pdftk "{0}" fill_form "{1}" output "{2}" dont_ask'.format(pdf_file, tmp_file, output_file)
    os.system(cmd)
    os.remove(tmp_file)
    print "Printed data to pdf!"

opts, args = getopt.getopt(sys.argv[1:], '', ["Name=", "Address=", "Apt=", "Zip=", "Tel="])

formatted_data = []

for opt, a in opts:
    if opt=='--Name':
        formatted_data.append(('Name', a))
    elif opt=='--Address':
        formatted_data.append(('Address', a))
    elif opt=='--Apt':
        formatted_data.append(('Apt', a))
    elif opt=='--Zip':
        formatted_data.append(('Zip', a))

print formatted_data

form_fill(formatted_data)

#def generate_pdf(req):

    #print req

    #form_fill(req)
    #return True
