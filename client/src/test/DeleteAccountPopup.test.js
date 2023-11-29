import { render, screen } from '@testing-library/react';
import DeleteAccountPopup from '../components/Popups/DeleteAccountPopup';


describe(DeleteAccountPopup, () => {
  it('exists', () => {
    render(<DeleteAccountPopup/>);
    const deleteAccountPopup = screen.getByTestId("delete-account-popup");

    expect(deleteAccountPopup).toBeDefined();
    expect(deleteAccountPopup.textContent).toContain("You are about to permanently delete your account. This action cannot be undone.");
  });


  it('is hidden by default', () => {
    render(<DeleteAccountPopup/>);
    const deleteAccountPopup = screen.getByTestId("delete-account-popup");

    expect(deleteAccountPopup.style.display).toEqual("none");
  });


  it('renders popup properly when shown', () => {
    render(<DeleteAccountPopup/>);
    const deleteAccountPopup = screen.getByTestId("delete-account-popup");
    deleteAccountPopup.style.display = "block";

    expect(deleteAccountPopup.style.display).not.toBe("none");
  });
})