import * as response from '../../utils/Response.js'
import { ValidateFields } from './utils/FileUtils.js'
import config from '../../config/Config.js'
import vision from '@google-cloud/vision'
import path from 'path'
import { GvisionPDF } from './utils/gvision.js'
import { GPT3 } from './utils/openai.js'

export async function ExtractInvoice(req, res) {
    try {

        // validate fields
        if(req.files == undefined){
            return response.fail(res, 'No documents found')
        }

        if(!ValidateFields(req.files)){
            return response.fail(res, 'Invalid documents')
        }

        // get file
        const file = req.files.file[0]

        // extract text from file
        const extractedText = await GvisionPDF(file.buffer)


        // send text to gpt3
        const message = 
        `
        Extract structured information in JSON format from text extracted from a PDF using OCR.
        - If tax is not given, calculate tax at 5% on all items.
        - Try to retrieve the full delivery address.
        - Do not round numbers, put them as they are.
        - The data is extracted from different templates, but mostly from a table of data.
        - Extract the following information: company name, date, order number, delivery address, grand total, total tax, items with description, quantity, unit price, total, tax, unit.
        - return your confidence score of the extracted data.
        - try to do the whole process multiple times and return the best result.
        - do not add any additional information to the output, just the extracted data in JSON format.

        Note:
        Some of the requested data might not be available, so just extract what you can and ignore the rest without informing that the data is missing.

        Information to extract:
        company name, date, order number, delivery address, grand total, total tax, items with description, quantity, unit price, total, tax, unit
        
        Output example format:
        {
          "extractedData": {
            "company_name": "LETO CAFE - DUBAI MALL",
            "Date": "04.05.2022",
            "orderNumber": "B202205-05934",
            "deliveryAddress": "FASHION AVENUE 2ND FLOOR, DUBAI MALL UAE",
            "grandTotal": 593.78,
            "total_tax": 28.28,
            "items": [
              {
                "description": "Still Water  Large",
                "quantity": "5.0",
                "unitPrice": "52.0",
                "total": "273.0",
                "tax": "13.00",
                "unit": "12x1 LTR"
              },
              {
                "description": "Still Water  Small",
                "quantity": "5.0",
                "unitPrice": "61.1",
                "total": "320.78",
                "tax": "15.28",
                "unit": "24x500 ML (EACH)"
              }
            ]
          }
        }
        
        Extracted text: ${extractedText}`

        const gptResponse = await GPT3(message)

        return response.success(res, gptResponse)
    }catch (error) {
        return response.system(res, error)
    }
}