const crypto = require('../src/crypto');
let obj = {
  transfer_id: 'b906f94787bd44377b858bff54895fbc24d9a86aad2f5b5cee8532a4cc7fedba',
  permission_status: 'REJECTED',
  signature:
    'a786f6248df48df83a96e4fc01a6796eb4ab6b4b594b118b029af8dbb7b0981be62465d389d263cf2f31afd55cd558a478ff0a5eeb6d3dcc6639d3c27dc551f8',
}
const validation = crypto.verifyObject(
  obj,
  '0480664cd8fd8c93f0220eb0c2bab467608d90a291ea037b9932387f56a656f35e9a976a1623232643f82b1da0cf5b9a3bf2bda2b5cf30e5ee85a0d5a2011ea4f1'
)
console.assert(validation === true, 'Signature should be valid.')
