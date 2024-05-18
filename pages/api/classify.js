import { VisualRecognitionV3 } from 'ibm-watson';

export default async function handler(req, res) {
  const visualRecognition = new VisualRecognitionV3({
    version: '2021-08-20',
    authenticator: new IamAuthenticator({
      apikey: 'our-ibm-wat-api-key',
    }),
    serviceUrl: 'our-ibm-wat-service-url',
  });

  const classifyParams = {
    imagesFile: req.body.image,
    classifierIds: ['food'],
  };

  const classificationResult = await visualRecognition.classify(classifyParams);
  res.status(200).json(classificationResult);
}