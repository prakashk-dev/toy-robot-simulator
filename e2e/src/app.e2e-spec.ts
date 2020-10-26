import { AppPage } from './app.po';

describe('workspace-project App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
    page.navigateTo();
  });

  it('should display correct', () => {
    expect(page.getTitleText()).toEqual('Toy Robot Simulator');
  });

  it('should validate inputs before clicking PLACE command', () => {
    const xCoordinateInput = page.getElementByCss('#xCoordinate');
    const yCoordinateInput = page.getElementByCss('#yCoordinate');
    const currentFacingInput = page.getElementByCss('#currentFacing');
    const placeButton = page.getElementByCss('#placeButton');

    // try with invalid value and check if error is present
    xCoordinateInput.sendKeys(5);
    yCoordinateInput.sendKeys(5);

    const xError = page.getElementByCss('#mat-error-0');
    expect(xError.getText()).toEqual('xCoordinate must be between 0 and 4, and a whole number.');

    currentFacingInput.click();
    page.waitToBeClickable('#mat-option-0');
    page.getElementByCss('#mat-option-0').click();

    const yError = page.getElementByCss('#mat-error-1');
    expect(yError.getText()).toEqual('yCoordinate must be between 0 and 4, and a whole number.');
    expect(placeButton.isEnabled()).toBe(false);

    // now input valid x and y coordinate
    xCoordinateInput.clear();
    yCoordinateInput.clear();
    xCoordinateInput.sendKeys(0);
    yCoordinateInput.sendKeys(2);

    expect(xError.isPresent()).toBe(false);
    expect(yError.isPresent()).toBe(false);
    expect(placeButton.isEnabled()).toBe(true);

  });

  it('should not allow to MOVE, LEFT, RIGHT and REPORT command if initial PLACE command is not set', () => {
    const moveButton = page.getElementByCss('#moveButton');
    const leftButton = page.getElementByCss('#leftButton');
    const rightButton = page.getElementByCss('#rightButton');
    const reportButton = page.getElementByCss('#reportButton');

    expect(moveButton.isEnabled()).toBe(false);
    expect(leftButton.isEnabled()).toBe(false);
    expect(rightButton.isEnabled()).toBe(false);
    expect(reportButton.isEnabled()).toBe(false);

  });


  it('should show correct message when clicking report button', () => {
    const xCoordinateInput = page.getElementByCss('#xCoordinate');
    const yCoordinateInput = page.getElementByCss('#yCoordinate');
    const currentFacingInput = page.getElementByCss('#currentFacing');
    const placeButton = page.getElementByCss('#placeButton');
    const moveButton = page.getElementByCss('#moveButton');
    const reportButton = page.getElementByCss('#reportButton');

    xCoordinateInput.sendKeys(0);
    yCoordinateInput.sendKeys(0);
    currentFacingInput.click();

    page.waitToBeClickable('#mat-option-0');
    page.getElementByCss('#mat-option-0').click();

    placeButton.click();
    moveButton.click();
    reportButton.click();
    const notificationMessage = page.getElementByCss('#notificationMessage');
    expect(notificationMessage.getText()).toBe('0, 1, north');

  });

});
