module.exports = {
  BVRC001: 'BVRC001',
  BVRC002: 'BVRC002',
  BVRC003: 'BVRC003',
  BVRC004: 'BVRC004',
  BVRC999: 'BVRC999'
};

const RejectCode = {
  BVRC001: 'BVRC001',
  BVRC002: 'BVRC002',
  BVRC003: 'BVRC003',
  BVRC004: 'BVRC004',
  BVRC999: 'BVRC999'
}

const RejectMessage = {
  BVRC001: 'unsupported_currency',
  BVRC002: 'service_downtime',
  BVRC003: 'exceed_trading_volume',
  BVRC004: 'compliance_check_fail',
  BVRC999: 'other'
}

module.exports = {
  RejectCode,
  RejectMessage
};