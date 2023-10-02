import invariant from 'ts-invariant';

class ScriptManager {
  private findScript() {
    const loaderScript = document.getElementById('kitchen-table-loader');
    invariant(loaderScript, 'loaderScript is required');
    return loaderScript;
  }

  getServerUrl() {
    const url = this.findScript().getAttribute('data-url');
    invariant(url, 'url is required');
    return url;
  }
}

export default ScriptManager;
