import BreadCrumbs from '../components/BreadCrumbs/BreadCrumbs';


describe('BreadCrumbs unit tests', () => {
  it('exists', () => {
    expect(BreadCrumbs).toBeDefined();
  })

  it('contains the proper elements', () => {
    expect(BreadCrumbs.toString()).not.toBe(undefined);
    expect(BreadCrumbs.toString()).toContain("center menu sticky-breadcrumbs-menu");
    expect(BreadCrumbs.toString()).toContain("login");
    expect(BreadCrumbs.toString()).toContain("signup");
    expect(BreadCrumbs.toString()).not.toContain("input");
  });
});