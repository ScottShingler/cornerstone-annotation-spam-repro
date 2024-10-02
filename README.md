> Tested with node v18.20.3

#### Instructions

To Run:
1. `yarn install`
2. `npm run build`
3. `npx webpack serve`
4. Go to https://localhost:8080
5. Open developer tools (F12) and switch to the console view

#### Issue #1 - CircleROITool

1. Click the **Activate CircleROI** button
2. Draw a circle on either viewport
3. Move the circle outside the image into the black area
4. Observe messages in the console

Expected behaviour: ANNOTATION_UPDATED events should only be triggered when moving or resizing the annotation.

Actual behaviour: Extra ANNOTATION_MODIFIED events are triggered when the annotation is at rest when any part of it outside the image.

#### Issue #2 - PlanarFreehandROITool

1. Click the **Activate PlanarFreehandROI** button
2. Draw an **open** contour within the image
3. Observe messages in the console

Expected behaviour: ANNOTATION_UPDATED events should only be triggered while drawing the annotation.

Actual behaviour: Extra ANNOTATION_MODIFIED events are triggered when the annotation is completed.

#### Credits

Images used are from the Cancer Imaging Archive: https://www.cancerimagingarchive.net/collection/lung-fused-ct-pathology/