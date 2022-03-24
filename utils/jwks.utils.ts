import * as fs from 'fs';
import * as jwkpem from 'rsa-pem-to-jwk';

const privkey = fs.readFileSync('../certs/private.pem');
const jwk = jwkpem.rsaPemToJwk(privkey, { use: 'sig' }, 'public');
console.log(jwk);
