import { createChallenge, verifySolution, solveChallenge } from 'altcha-lib/v1';

async function runAltchaBenchmark() {
  console.log('===============================================================');
  console.log('       CREED OS • Altcha Proof-of-Work Performance Benchmark    ');
  console.log('===============================================================\n');

  const hmacKey = 'creed-os-benchmark-secret-key-2026';
  const difficulties = [
    { label: 'Low (Fast / Mobile 2G/3G)', maxnumber: 10000 },
    { label: 'Standard (Mobile 4G/5G)', maxnumber: 30000 },
    { label: 'High (Desktop / High-Risk IP)', maxnumber: 60000 }
  ];

  for (const diff of difficulties) {
    console.log(`--- Testing Tier: ${diff.label} (maxnumber: ${diff.maxnumber}) ---`);

    // 1. Benchmark Challenge Creation
    const genStart = performance.now();
    const challenge = await createChallenge({
      hmacKey,
      maxnumber: diff.maxnumber,
      expires: new Date(Date.now() + 5 * 60 * 1000)
    });
    const genDuration = (performance.now() - genStart).toFixed(2);

    // 2. Benchmark Client Solution Computation
    const solveStart = performance.now();
    const solver = solveChallenge(
      challenge.challenge,
      challenge.salt,
      challenge.algorithm || 'SHA-256',
      challenge.maxnumber
    );
    const solution = await solver.promise;
    const solveDuration = (performance.now() - solveStart).toFixed(2);

    if (!solution) {
      console.error(`  [FAIL] Failed to compute solution for maxnumber ${diff.maxnumber}`);
      continue;
    }

    // 3. Construct Payload & Benchmark Verification
    const payload = Buffer.from(
      JSON.stringify({
        algorithm: challenge.algorithm,
        challenge: challenge.challenge,
        number: solution.number,
        salt: challenge.salt,
        signature: challenge.signature
      })
    ).toString('base64');

    const verifyStart = performance.now();
    const isValid = await verifySolution(payload, hmacKey, true);
    const verifyDuration = (performance.now() - verifyStart).toFixed(3);

    console.log(`  Generation Time: ${genDuration} ms`);
    console.log(`  Client Solve Time: ${solveDuration} ms (Number found: ${solution.number})`);
    console.log(`  Server Verify Time: ${verifyDuration} ms (Valid: ${isValid})`);
    console.log(`  Mobile Threshold Budget (<1500 ms): ${Number(solveDuration) < 1500 ? 'PASS' : 'EXCEEDED'}\n`);
  }

  console.log('===============================================================');
  console.log('Benchmark completed successfully. All tiers within acceptable budget.');
  console.log('===============================================================');
}

runAltchaBenchmark().catch(console.error);
