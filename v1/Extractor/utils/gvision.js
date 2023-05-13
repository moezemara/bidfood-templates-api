import config from '../../../config/Config.js'
import vision from '@google-cloud/vision'
import path from 'path'


export async function GvisionPDF(file){
    const RelaitvePath = path.join(path.resolve('.'), config.GoogleVisionKeyPath)

    const client = new vision.ImageAnnotatorClient({
        keyFilename: RelaitvePath
    });

    const inputConfig = {
        mimeType: 'application/pdf',
        content: file,
    };

    const features = [{type: 'DOCUMENT_TEXT_DETECTION'}];
    const request = {
        requests: [
            {
                inputConfig: inputConfig,
                features: features,
            },
        ],
    };


    const [result] = await client.batchAnnotateFiles(request);
    const responses = result.responses[0];
    const extractedText = responses.responses[0].fullTextAnnotation.text;

    return extractedText
}
