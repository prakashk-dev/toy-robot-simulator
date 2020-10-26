import { browser, by, element, ElementFinder, ExpectedConditions as EC } from 'protractor';

export class AppPage {
  navigateTo(): Promise<unknown> {
    return browser.get(browser.baseUrl) as Promise<unknown>;
  }

  getTitleText(): Promise<string> {
    return element(by.css('h1')).getText() as Promise<string>;
  }

  getElementByCss(selector: string): ElementFinder {
    return element(by.css(selector));
  }

  waitToBeClickable(selector: string): Promise<unknown> {
    return browser.wait(EC.elementToBeClickable(this.getElementByCss(selector)), 5000) as Promise<unknown>;
  }

  waitForAnElement(selector: string): Promise<unknown> {
    return browser.wait(EC.presenceOf(this.getElementByCss(selector)), 5000) as Promise<unknown>;
  }
}
