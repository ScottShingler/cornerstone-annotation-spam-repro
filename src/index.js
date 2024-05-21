import {
    RenderingEngine,
    Enums,
    init as csRenderInit,
    getConfiguration,
    getRenderingEngine
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

global.getRenderingEngine = getRenderingEngine;

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

initCornerstoneDICOMImageLoader();
await csRenderInit();
await csToolsInit();

addTool(PanTool);

const viewportId = 'myViewport';
const renderingEngineId = 'myRenderingEngine';
const toolGroupId = 'myToolGroup';

const renderingEngine = new RenderingEngine(renderingEngineId);

const toolGroup = ToolGroupManager.createToolGroup(toolGroupId);
toolGroup.addTool(PanTool.toolName);

const test = () => {
    const content = document.getElementById('cornerstone');

    const element = document.createElement('div');

    // Disable the default context menu
    element.oncontextmenu = (e) => e.preventDefault();
    element.style.width = '500px';
    element.style.height = '500px';

    content.appendChild(element);

    element.oncontextmenu = (e) => e.preventDefault();

    const viewportInput = {
        viewportId,
        element,
        type: ViewportType.STACK,
    };

    renderingEngine.enableElement(viewportInput);

    const viewport = renderingEngine.getViewport(viewportId);
    const imageId = "wadouri:https://localhost:8080/test.dcm"

    viewport.setStack([imageId], 0);
    viewport.render();

    toolGroup.addViewport(viewportId, renderingEngineId);
}

global.enable_tool = () => {
    toolGroup.setToolActive(PanTool.toolName, {
        bindings: [
            {
                mouseButton: csToolsEnums.MouseBindings.Primary, // Left Click
            },
        ],
    });
}

test();