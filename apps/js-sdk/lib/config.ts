import invariant from 'ts-invariant';

class Config {
  private findScript() {
    const loaderScript = document.getElementById('kitchen-table-loader');
    invariant(loaderScript, 'loaderScript is required');
    return loaderScript;
  }

  getServerUrl() {
    const url = this.findScript().getAttribute('data-url');
    invariant(url, 'url is required. add data-url attribute to script tag');
    return url;
  }

  getIsActivateExperimental() {
    return this.findScript().getAttribute('data-experimental') === 'true';
  }

  getMoveEventThrottleMs() {
    const customThrottle = this.findScript().getAttribute('data-move-event-throttle');
    if (Number.isNaN(customThrottle)) {
      return 30; // as default
    }
    return Number(customThrottle);
  }
}

export default Config;
