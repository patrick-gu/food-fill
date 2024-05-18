import { VisualRecognitionV3 } from 'ibm-watson';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  upload.single('image')(req, res, async function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }

    const visualRecognition = new VisualRecognitionV3({
      version: '2021-08-20',
      serviceName: 'visual-recognition',
      authenticator: new IamAuthenticator({
        apikey: 'our-ibm-wat-api-key',
      }),
      serviceUrl: 'our-ibm-wat-service-url',
    });

    const imagePaths = ['/path/to/image1.jpg', '/path/to/image2.jpg'] // can continue to add more
    const results = [];

    for (let i = 0; i < imagePaths.length; i++) {
        const classifyParams = {
          imagesFile: fs.createReadStream(imagePaths[i]),
          classifierIds: ['food'],
        };

        const classificationResult = await visualRecognition.classify(classifyParams);
        results.push(classificationResult);

        if ((i + 1) % 20 === 0){
            await new Promise(resolve => setTimeout(resolve, 60000)); // if 20 images sent, wait 1 min
        } else {
            await new Promise(resolve => setTimeout(resolve, 2000)); // if not, wait 2 seconds
        }
    }
  });
}
res.status(200).json({ results });