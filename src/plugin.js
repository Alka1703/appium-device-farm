import BasePlugin from '@appium/base-plugin';
import ADB from 'appium-adb';
let portfinder = require('portfinder');

let connectedDevices;
let freePort;
portfinder.basePort = 60535;
export default class DevicePlugin extends BasePlugin {
  constructor(pluginName) {
    super(pluginName);
  }
  async createSession(next, driver, jwpDesCaps, jwpReqCaps, caps) {
    await this.getFreePort();
    console.log('FreePort', freePort);
    const adb = await ADB.createADB();
    connectedDevices = await adb.getConnectedDevices();
    if (connectedDevices.length > 0) {
      caps.firstMatch[0]['appium:deviceName'] = connectedDevices[0].udid;
      caps.firstMatch[0]['appium:systemPort'] = freePort;
    }
    return await driver.createSession(jwpDesCaps, jwpReqCaps, caps);
  }

  async getFreePort() {
    await portfinder.getPort(function (err, port) {
      freePort = port;
    });
  }
}
