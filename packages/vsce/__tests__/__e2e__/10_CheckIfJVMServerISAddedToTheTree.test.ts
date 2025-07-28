import { expect } from "chai";
import { DefaultTreeSection, TreeItem } from "vscode-extension-tester";
import { WIREMOCK_PROFILE_NAME, CICSEX61, REGIONS, REGIONS_LOADED, IYCWENW2, EYUCMCIJ } from "./util/constants";
import {
  sleep,
} from "./util/globalMocks";
import {
  getCicsSection,
  getPlexChildIndex,
  getPlexChildren,
  getRegionIndex,
  getRegionResourceIndex,
  getRegionsInPlex,
  openZoweExplorer,
} from "./util/initSetup.test";
import { resetAllScenarios } from "./util/resetScenarios";

describe("Check if JVM server is in the tree", () => {
  let cicsTree: DefaultTreeSection;

  before(async () => {
    await sleep(1900);
    const view = await openZoweExplorer();
    cicsTree = await getCicsSection(view);

    const wiremockServer = await cicsTree.findItem(WIREMOCK_PROFILE_NAME);
    expect(wiremockServer).exist;
    await sleep(100);
  });

  after(async () => {
    await resetAllScenarios();
  });

  describe("Checking Children of CICSEX61", () => {
    it("Verify CICSEX61 -> Regions", async () => {
      const cicsex61Children = await getPlexChildren(cicsTree, WIREMOCK_PROFILE_NAME, CICSEX61);
      expect(cicsex61Children).not.empty;

      const regionsIndex = await getPlexChildIndex(cicsex61Children, REGIONS);
      expect(regionsIndex).to.be.greaterThan(-1);
      cicsTree.takeScreenshot();
    });

    it("Verify CICSEX61 -> Regions -> IYCWENW2 contains JVM Servers label", async () => {
          // Open the regions under CICSEX61
          const regions = await getRegionsInPlex(cicsTree, WIREMOCK_PROFILE_NAME, CICSEX61);
          expect(regions).not.empty;

          // Find the IYCWENW2 region
          const regionIndex = await getRegionIndex(regions, IYCWENW2);
          expect(regionIndex).to.be.greaterThan(-1);

          // Get the children/resources under IYCWENW2
          const regionNode = regions[regionIndex];
          const regionChildren = await regionNode.getChildren();
          expect(regionChildren).not.empty;

          // Check if any child label is "JVM Servers"
          const labels = await Promise.all(regionChildren.map(child => child.getLabel()));
          expect(labels).to.include("JVM Servers");

          cicsTree.takeScreenshot();
        });    

  }); 
    it("Verify CICSEX61 -> Regions -> IYCWENW2 -> JVM Servers contains EYUCMCIJ", async () => {
    // Open the regions under CICSEX61
    const regions = await getRegionsInPlex(cicsTree, WIREMOCK_PROFILE_NAME, CICSEX61);
    expect(regions).not.empty;

    // Find the IYCWENW2 region
    const regionIndex = await getRegionIndex(regions, IYCWENW2);
    expect(regionIndex).to.be.greaterThan(-1);

    // Get the children/resources under IYCWENW2
    const regionNode = regions[regionIndex];
    const regionChildren = await regionNode.getChildren();
    expect(regionChildren).not.empty;

    // Find the "JVM Servers" node
    // const jvmServersIndex = (await Promise.all(regionChildren.map(child => child.getLabel())))
    //   .findIndex(label => label === "JVM Servers");
    // expect(jvmServersIndex).to.be.greaterThan(-1);
    const jvmServersIndex = (await Promise.all(regionChildren.map(child => child.getLabel())))
      .findIndex(label => label.startsWith("JVM Servers"));
    expect(jvmServersIndex).to.be.greaterThan(-1);

    // Open the "JVM Servers" node
    const jvmServersNode = regionChildren[jvmServersIndex];
    const jvmServerChildren = await jvmServersNode.getChildren();
    expect(jvmServerChildren).not.empty;

    // Check if any child label is "EYUCMCIJ"
    const jvmServerLabels = await Promise.all(jvmServerChildren.map(child => child.getLabel()));
    expect(jvmServerLabels).to.include("EYUCMCIJ");

    cicsTree.takeScreenshot();
  });

}); 

