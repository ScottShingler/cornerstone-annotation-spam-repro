import {
    RenderingEngine,
    Enums,
    init as csRenderInit,
    getConfiguration
} from '@cornerstonejs/core';

import * as cornerstone from '@cornerstonejs/core';

import dicomParser from 'dicom-parser';

import {
    addTool,
    ToolGroupManager,
    CircleROITool,
    Enums as csToolsEnums,
    init as csToolsInit,
} from '@cornerstonejs/tools';

import cornerstoneDICOMImageLoader from '@cornerstonejs/dicom-image-loader';

const { ViewportType } = Enums;

function initCornerstoneDICOMImageLoader() {
    const { preferSizeOverAccuracy, useNorm16Texture } = getConfiguration().rendering;
    cornerstoneDICOMImageLoader.external.cornerstone = cornerstone;
    cornerstoneDICOMImageLoader.external.dicomParser = dicomParser;
    cornerstoneDICOMImageLoader.configure({
        useWebWorkers: true,
        decodeConfig: {
            convertFloatPixelDataToInt: false,
            use16BitDataType: preferSizeOverAccuracy || useNorm16Texture,
        },
    });

    let maxWebWorkers = 1;

    if (navigator.hardwareConcurrency) {
        maxWebWorkers = Math.min(navigator.hardwareConcurrency, 7);
    }

    var config = {
        maxWebWorkers,
        startWebWorkersOnDemand: false,
        taskConfiguration: {
            decodeTask: {
                initializeCodecsOnStartup: false,
                strict: false,
            },
        },
    };

    cornerstoneDICOMImageLoader.webWorkerManager.initialize(config);
}

const viewport1Id = 'myViewport1';
const renderingEngine1Id = 'myRenderingEngine1';
const viewport2Id = 'myViewport2';
const renderingEngine2Id = 'myRenderingEngine2';
const toolGroupId = 'myToolGroup';

initCornerstoneDICOMImageLoader();
await csRenderInit();
csToolsInit();

addTool(CircleROITool);

const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
toolGroup.addTool(CircleROITool.toolName);

// Add images
var imageIds = [];
for(var i=1; i<=15; i++){
    const response = await fetch('/1-' + String(i).padStart(3, '0') + '.dcm');
    if (!response.ok) {
        console.error('HTTP error ' + response.status);
    }
    const blob = await response.blob();
    const imageId = cornerstoneDICOMImageLoader.wadouri.fileManager.add(blob);
    imageIds.push(imageId);
}

// Print out the dicom IDs as the dicom loader creates them
// They are all in the format dicom:<number>
console.log(imageIds);

const content = document.getElementById('cornerstone');

////////////////////
//// Viewport 1 ////
////////////////////

const element1 = document.createElement('div');

// Disable the default context menu
element1.oncontextmenu = (e) => e.preventDefault();
element1.style.width = '500px';
element1.style.height = '500px';
element1.style.margin = '1em';
element1.style.float = 'left';

content.appendChild(element1);

const renderingEngine1 = new RenderingEngine(renderingEngine1Id);

const viewportInput1 = {
    viewportId: viewport1Id,
    element: element1,
    type: ViewportType.STACK,
};

renderingEngine1.enableElement(viewportInput1);

const viewport1 = renderingEngine1.getViewport(viewport1Id);

// Add the images, and display image dicom:0
await viewport1.setStack(imageIds, 0); // ⚠️ CHANGE CODE HERE TO SEE DIFFERENT IMAGES

viewport1.render();

toolGroup.addViewport(viewport1Id, renderingEngine1Id);

////////////////////
//// Viewport 2 ////
////////////////////

const element2 = document.createElement('div');

// Disable the default context menu
element2.oncontextmenu = (e) => e.preventDefault();
element2.style.width = '500px';
element2.style.height = '500px';
element2.style.margin = '1em';
element2.style.float = 'left';

content.appendChild(element2);

const renderingEngine2 = new RenderingEngine(renderingEngine2Id);

const viewportInput2 = {
    viewportId: viewport2Id,
    element: element2,
    type: ViewportType.STACK,
};

renderingEngine2.enableElement(viewportInput2);

const viewport2 = renderingEngine2.getViewport(viewport2Id);

// Add the images, and display image dicom:10
await viewport2.setStack(imageIds, 10); // ⚠️ CHANGE CODE HERE TO SEE DIFFERENT IMAGES

viewport2.render();

toolGroup.addViewport(viewport2Id, renderingEngine2Id);

/////////////////////

// Force a render when the annotation is created to fix a sync issue
const forceRender = () => {
    viewport1.render();
    viewport2.render();
}
element2.addEventListener("mouseup", forceRender);
element2.addEventListener("mouseup", forceRender);

// Enable ROI tool
toolGroup.setToolEnabled(CircleROITool.toolName);
toolGroup.setToolActive(CircleROITool.toolName, {
    bindings: [
        {
            mouseButton: csToolsEnums.MouseBindings.Primary, // Left Click
        },
    ],
});