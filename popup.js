document.addEventListener('DOMContentLoaded', () => {
    const tabList = document.getElementById('tabList');    
    chrome.runtime.sendMessage({ action: 'fetchDevices' });
    
    chrome.storage.local.get(['otherDeviceTabs'], (data) => {

        console.dir(data);

        if (data.otherDeviceTabs && Object.keys(data.otherDeviceTabs).length > 0) {
            Object.keys(data.otherDeviceTabs).forEach((deviceName) => {
                const deviceDiv = document.createElement('div');
                deviceDiv.className = 'device';
                
                const deviceHeader = document.createElement('div');
                deviceHeader.className = 'device-header';
                deviceHeader.innerHTML = `<h3>${deviceName}</h3>`;
                
                const downloadIcon = document.createElement('span');
                downloadIcon.className = 'download-icon';
                downloadIcon.innerHTML = '📥'; // You can replace this with an actual icon if you prefer
                downloadIcon.style.cursor = 'pointer';
                downloadIcon.addEventListener('click', () => {
                    const tabs = data.otherDeviceTabs[deviceName];
                    const sortedTabs = tabs.sort((a, b) => a.url.localeCompare(b.url));
                    let markdownContent = `# ${deviceName} Tabs\n\n`;
                    sortedTabs.forEach((tab) => {
                        markdownContent += `- [${tab.title || tab.url}](${tab.url})\n`;
                    });
                    const blob = new Blob([markdownContent], { type: 'text/markdown' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${deviceName}-tabs.md`;
                    a.click();
                    URL.revokeObjectURL(url);
                });

                deviceHeader.appendChild(downloadIcon);
                deviceDiv.appendChild(deviceHeader);
                
                // Sort tabs by URL
                const sortedTabs = data.otherDeviceTabs[deviceName].sort((a, b) => a.url.localeCompare(b.url));
                
                sortedTabs.forEach((tab) => {
                    const tabDiv = document.createElement('div');
                    tabDiv.className = 'tab';
                    tabDiv.innerHTML = `<a href="${tab.url}" target="_blank">${tab.title || tab.url}</a>`;
                    deviceDiv.appendChild(tabDiv);
                });
        
                tabList.appendChild(deviceDiv);
            });
        } else {
          tabList.innerHTML = '<p>No tabs found on other devices.</p>';
        }
      });
});