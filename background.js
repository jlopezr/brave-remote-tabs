chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'fetchDevices') {
        fetchDevicesAndStore();
    }
});

function fetchDevicesAndStore() {
    chrome.sessions.getDevices((devices) => {
        if (chrome.runtime.lastError) {
            console.error('Error fetching devices:', chrome.runtime.lastError.message);
            return;
        }

        //console.log("Devices: ", devices);

        const otherDeviceTabs = {};
        devices.forEach((device) => {
            //console.log("Device: ", device.deviceName);
            device.sessions.forEach((session) => {
                //console.log("Session: ", session);
                if (session.window.tabs) {
                    if(!otherDeviceTabs[device.deviceName]) {
                        otherDeviceTabs[device.deviceName] = session.window.tabs;
                    } else {
                        otherDeviceTabs[device.deviceName] = otherDeviceTabs[device.deviceName].concat(session.window.tabs);
                    }
                }
            });
        });

        console.dir(otherDeviceTabs)

        // Store the retrieved tabs in local storage
        chrome.storage.local.set({ otherDeviceTabs }, () => {
            console.log('Other device tabs stored successfully.');
        });
    });
}