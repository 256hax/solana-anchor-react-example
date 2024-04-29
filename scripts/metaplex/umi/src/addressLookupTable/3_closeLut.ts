// Docs: https://mpl-toolbox-js-docs.vercel.app/functions/deactivateLut.html

// Lib
import * as bs58 from 'bs58';
import * as dotenv from 'dotenv';

// Metaplex
import {
  keypairIdentity,
  publicKey,
} from '@metaplex-foundation/umi';
import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { closeLut } from '@metaplex-foundation/mpl-toolbox';

const main = async () => {
  // ----------------------------------------------------
  //  Setup
  // ----------------------------------------------------
  dotenv.config();

  const endpoint = process.env.ENDPOINT;
  if (!endpoint) throw new Error('endpoint not found.');
  const umi = createUmi(endpoint);

  // Set Payer
  const payerSecretKey = process.env.PAYER_SECRET_KEY;
  if (!payerSecretKey) throw new Error('payerSecretKey not found.');
  const secretKeyUInt8Array = new Uint8Array(JSON.parse(payerSecretKey));
  const payerKeypair =
    umi.eddsa.createKeypairFromSecretKey(secretKeyUInt8Array);
  umi.use(keypairIdentity(payerKeypair));

  // ----------------------------------------------------
  //  Create a Deactive LUT Instructions
  // ----------------------------------------------------
  const address = publicKey('DD6xxSHmvDyBvttrcH2bHgichFCDEkp7fZxuSWcH234e');
  const authority = umi.payer;
  const recipient = umi.payer.publicKey;

  const instruction = closeLut(umi, {
    address,
    authority,
    recipient,
  });

  // ----------------------------------------------------
  //  Send Transaction
  // ----------------------------------------------------
  const result = await instruction.sendAndConfirm(umi);

  console.log('signature =>', bs58.encode(result.signature));
};

main();

/*
ts-node src/addressLookupTable/3_closeLut.ts
signature => 3qLEnufX3TmPppy2f6Hrqchy74s8jTKnwTndTvc9TDeU6mp2QhyhwXmgKV4wsRpBfurCyUwuenZx9ujDAeHVn8a6
*/
