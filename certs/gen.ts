import { readFileSync } from 'fs';

const privKey = readFileSync('./private.pem');
const pubKey = readFileSync('./public.pem');
const convertpriv = Buffer.from(privKey).toString('base64');
const convertpub = Buffer.from(pubKey).toString('base64');

// Save this into .env
// To get back
const origpriv = Buffer.from(convertpriv, 'base64').toString('ascii');
const origpub = Buffer.from(convertpub, 'base64').toString('ascii');
