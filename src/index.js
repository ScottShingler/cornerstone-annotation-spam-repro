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
    PanTool,
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

const viewportId = 'myViewportn';
const renderingEngineId = 'myRenderingEnginen';
const toolGroupId = 'myToolGroupn';

initCornerstoneDICOMImageLoader();
await csRenderInit();
csToolsInit();

addTool(PanTool);

const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
toolGroup.addTool(PanTool.toolName);


// const imageIds = await createImageIdsAndCacheMetaData({
//     StudyInstanceUID:
//         '1.3.6.1.4.1.14519.5.2.1.7009.2403.334240657131972136850343327463',
//     SeriesInstanceUID:
//         '1.3.6.1.4.1.14519.5.2.1.7009.2403.226151125820845824875394858561',
//     wadoRsRoot: 'https://d3t6nz73ql33tx.cloudfront.net/dicomweb',
// });

const imageIds = ["wadouri:https://localhost:8080/test.dcm"];

const content = document.getElementById('cornerstone');

const element = document.createElement('div');

// Disable the default context menu
element.oncontextmenu = (e) => e.preventDefault();
element.style.width = '500px';
element.style.height = '500px';

content.appendChild(element);

const renderingEngine = new RenderingEngine(renderingEngineId);

const viewportInput = {
    viewportId,
    element,
    type: ViewportType.STACK,
};

renderingEngine.enableElement(viewportInput);

const viewport = renderingEngine.getViewport(viewportId);

await viewport.setStack(imageIds, 0);
viewport.render();

toolGroup.addViewport(viewportId, renderingEngineId);

toolGroup.setToolEnabled(PanTool.toolName);
toolGroup.setToolActive(PanTool.toolName, {
    bindings: [
        {
            mouseButton: csToolsEnums.MouseBindings.Primary, // Left Click
        },
    ],
});