import { NavigateFunction } from 'react-router-dom';
import { NavigationClient } from '@azure/msal-browser';

export class CustomNavigationClient extends NavigationClient {
  router: NavigateFunction;

  constructor(r: NavigateFunction) {
    super();
    this.router = r;
  }

  async navigateInternal(url: string, options: { noHistory?: boolean }) {
    const relativePath = url.replace(window.location.origin, '');
    if (options.noHistory) {
      this.router(relativePath, { replace: true });
    } else {
      this.router(relativePath);
    }

    return false;
  }
}
