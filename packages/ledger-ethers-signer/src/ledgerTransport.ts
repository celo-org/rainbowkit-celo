import TransportU2F from '@ledgerhq/hw-transport-u2f'
import TransportWebHID from '@ledgerhq/hw-transport-webhid'
// import TransportWebUSB from '@ledgerhq/hw-transport-webhid'

export async function getLedgerTransport() {
  // if (transport) return transport
  // Replacing WebUSB for WebHID because usb is broken in latest chrome
  // https://github.com/LedgerHQ/ledgerjs/issues/607
  // if (await TransportWebUSB.isSupported()) {
  //   console.debug('WebUSB appears to be supported')
  //   return TransportWebUSB.create()
  // }
  if (await TransportWebHID.isSupported()) {
    console.debug('WebHID appears to be supported')
    return TransportWebHID.create()
  } else if (await TransportU2F.isSupported()) {
    console.debug('U2F appears to be supported')
    // Note: Won't work when running from localhost
    return TransportU2F.create()
  } else {
    throw new Error('No transport protocols are supported')
  }
}
