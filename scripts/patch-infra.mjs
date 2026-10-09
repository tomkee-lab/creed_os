import fs from 'fs';
import path from 'path';

// Fix for Better Auth Infra JWT clock skew issue on Windows/Cloudflare
const targetFiles = [
  'node_modules/@better-auth/infra/dist/index.mjs',
  'apps/web/node_modules/@better-auth/infra/dist/index.mjs'
];

const target = 'jwtVerify(jwsFromHeader, remoteJWKs, { maxTokenAge: "5m" })';
const replacement = 'jwtVerify(jwsFromHeader, remoteJWKs, { maxTokenAge: "5m", clockTolerance: "60s" })';

for (const relPath of targetFiles) {
  const fullPath = path.resolve(relPath);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes(target)) {
      content = content.replaceAll(target, replacement);
      fs.writeFileSync(fullPath, content);
      console.log(`[patch-infra] Patched ${relPath} with clockTolerance: "60s"`);
    } else if (content.includes('clockTolerance: "60s"')) {
      console.log(`[patch-infra] ${relPath} is already patched.`);
    }
  }
}
