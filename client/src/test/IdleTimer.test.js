import { render, screen } from '@testing-library/react';
import IdleTimer from '../components/IdleTimer/IdleTimer';


describe('IdleTimer', () => {
  it("exists", () => {
    render(<IdleTimer/>);
    const tokenPopup = screen.getByTestId("token-popup");

    expect(tokenPopup).toBeDefined();
    expect(tokenPopup.textContent).toContain("Your session is about to expire. Would you like to refresh your session?");
  });


  it("is hidden by default", () => {
    render(<IdleTimer/>);
    const tokenPopup = screen.getByTestId("token-popup");

    expect(tokenPopup.style.display).toEqual("none");
  });

  
  it("renders popup properly when shown", () => {
    render(<IdleTimer/>);
    const tokenPopup = screen.getByText("WARNING!");
    tokenPopup.style.display = "block";

    expect(tokenPopup.style.display).not.toBe("none");
  });
});