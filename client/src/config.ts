// story: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '84e2s28rje'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // story: Create an Auth0 application and copy values from it into this map. For example:
  // domain: 'dev-nd9990-p4.us.auth0.com',
  domain: 'dev-n-5swlpw.us.auth0.com',            // Auth0 domain
  clientId: 'fKxDjmbCyBw8NVTCvZtHgdRJ4aTV2NU0',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
